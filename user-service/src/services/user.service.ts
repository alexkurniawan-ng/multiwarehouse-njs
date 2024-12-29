import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GetUserRequestDto } from 'src/dtos/get-user.request.dto';
import EmailService from './email.service';
import { Role as RoleEntity } from 'src/entities/role.entity';
import { Role as RoleEnum } from 'src/enums/role.enum';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, QueryFailedError, Repository } from 'typeorm';
import { AppBadRequestException } from 'exceptions/app-bad-request.exception';
import { CreateUserByAdminRequestDto } from 'src/dtos/create-user-by-admin.request.dto';
import { ResultModelResponseDto } from 'src/dtos/result.response.dto';
import { CreateAdminBySuperAdminRequestDto } from 'src/dtos/create-admin-by-super-admin.request.dto';
import { RegisterRequestDto } from 'src/dtos/register.request.dto';
import { UserProfileResponseDto } from 'src/dtos/user-profile.response.dto';
import { GetOwnUsersResponseDto } from 'src/dtos/get-own-users.response.dto';
import { ForgotPasswordRequestDto } from 'src/dtos/forgot-password.request.dto';
import { ResetPasswordRequestDto } from 'src/dtos/reset-password.request.dto';
import { ChangePasswordRequestDto } from 'src/dtos/change-pasword.request.dto';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  private readonly passwordPepper: string;
  private readonly verifyEmailExpiry: string;
  private readonly verifyEmailUrl: string;
  private readonly forgotPasswordExpiry: string;
  private readonly forgotPasswordUrl: string;
  private readonly forgotPasswordSecret: string;
  constructor(
    private readonly emailService: EmailService,
    private configService: ConfigService,
    private jwtService: JwtService,
    // @InjectMapper() private mapper: Mapper,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {
    this.passwordPepper = this.configService.get<string>('PASSWORD_PEPPER');
    this.verifyEmailUrl = this.configService.get<string>('VERIFY_EMAIL_URL');
    this.verifyEmailExpiry = this.configService.get<string>(
      'JWT_VERIFY_EMAIL_EXPIRY',
    );
    this.forgotPasswordExpiry = this.configService.get<string>(
      'JWT_FORGOT_PASSWORD_EXPIRY',
    );
    this.forgotPasswordUrl = this.configService.get<string>(
      'FORGOT_PASSWORD_URL',
    );
    this.forgotPasswordSecret = this.configService.get<string>(
      'JWT_FORGOT_PASSWORD_SECRET',
    );
  }

  async onApplicationBootstrap() {
    await this.createRolesIfNotExist();
    await this.createAdminIfNotExist();
  }

  // EVENTS
  private readonly users: any[] = [
    {
      userId: '123',
      stripeUserId: '43234',
    },
    {
      userId: '345',
      stripeUserId: '27279',
    },
  ];

  getHello(): string {
    return 'Hello World!';
  }

  // REST
  public getUser(getUserRequest: GetUserRequestDto) {
    return this.users.find((user) => user.userId === getUserRequest.userId);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) throw new AppBadRequestException('INVALID_USER');
    return user;
  }

  async generatePasswordHash(password: string): Promise<string> {
    return await this.hashPassword(password, this.passwordPepper);
  }

  public async getUserByEmail(
    email: string,
    // isGoogle: boolean = false,
  ): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email: email.toLowerCase(),
        // isGoogle
      },
      relations: {
        roles: true,
      },
    });
  }

  async createUserByAdmin(
    userDto: CreateUserByAdminRequestDto,
  ): Promise<ResultModelResponseDto> {
    await this.checkEmailValidity(userDto.email);
    // const newUser = this.mapper.map(userDto, CreateUserByAdminRequestDto, User);
    const newUser = new User();
    newUser.email = userDto.email.toLowerCase();
    newUser.fullName = userDto.fullName;
    newUser.passwordHash = await this.generatePasswordHash(userDto.password);
    const role = await this.getRoleByName(userDto.role);
    if (!role) throw new AppBadRequestException('Invalid Role');
    newUser.roles = new Array(role);

    await this.userRepository.save(newUser);
    return new ResultModelResponseDto(true, 'User Created');
  }

  async createAdminBySuperAdmin(
    adminDto: CreateAdminBySuperAdminRequestDto,
  ): Promise<ResultModelResponseDto> {
    await this.checkEmailValidity(adminDto.email);
    adminDto.email = adminDto.email.toLowerCase();

    const newCompanyAdmin = new User();
    newCompanyAdmin.email = adminDto.email;
    newCompanyAdmin.fullName = adminDto.fullName;
    newCompanyAdmin.passwordHash = await this.generatePasswordHash(
      adminDto.password,
    );
    const adminRole = await this.getRoleByName(RoleEnum.Admin);
    newCompanyAdmin.roles = new Array(adminRole);
    console.log({ newCompanyAdmin });
    await this.userRepository.save(newCompanyAdmin);
    return new ResultModelResponseDto(true, 'Admin Created');
  }

  async register(
    registerDto: RegisterRequestDto,
  ): Promise<ResultModelResponseDto> {
    const { email, fullName } = registerDto;
    await this.checkEmailValidity(email);

    try {
      const newUser = new User();
      newUser.email = email.toLowerCase();
      newUser.fullName = fullName;
      newUser.roles = new Array(await this.getRoleByName(RoleEnum.User));
      await this.sendVerifyEmail(fullName, email.toLowerCase());

      await this.userRepository.save(newUser);
      console.log(
        `User created with email: ${email} and Full Name: ${fullName}`,
      );
    } catch (error) {
      console.error('Error saving new user:', error);
      throw error;
    }
    // await this.userRepository.save(newUser);
    return new ResultModelResponseDto(true, 'Email Registered');
  }

  async getUserProfile(userId: number): Promise<UserProfileResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        roles: true,
      },
    });
    if (!user) throw new AppBadRequestException('INVALID_USER');
    const userProfile: UserProfileResponseDto = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      roles: user.roles.map((role) => role.name),
    };
    return userProfile;
  }

  // async getOwnUsers(): Promise<GetOwnUsersResponseDto[]> {
  //   const users = await this.userRepository.find({
  //     relations: { roles: true },
  //   });
  //   const usersWithRole = this.mapper.mapArray(
  //     users,
  //     User,
  //     GetOwnUsersResponseDto,
  //   );
  //   for (let i = 0; i < usersWithRole.length; i++) {
  //     usersWithRole[i].roles = users[i].roles.map((role) => role.name);
  //   }
  //   return usersWithRole;
  // }

  async forgotPassword(body: ForgotPasswordRequestDto) {
    const { email } = body;
    const user = await this.getUserByEmail(email);
    if (!user) throw new AppBadRequestException('Email Not Found.');
    await this.sendForgotPasswordEmail(user.fullName, user.email);
    console.log(`User sent email to reset password: ${email}`);
    return new ResultModelResponseDto(true, 'Email Sent');
  }

  async resetPassword(
    token: string,
    body: ResetPasswordRequestDto,
  ): Promise<ResultModelResponseDto> {
    const email = await this.decodeJWTForgotPasswordToken(token);
    const user = await this.getUserByEmail(email);
    if (!user) throw new AppBadRequestException('Invalid Email');
    this.checkPasswordConfirmation(body.newPassword, body.confirmNewPassword);
    user.passwordHash = await this.hashPassword(
      body.newPassword,
      this.passwordPepper,
    );
    await this.userRepository.save(user);

    return new ResultModelResponseDto(
      true,
      'Password Successfully Set or Resetted',
    );
  }

  async changePassword(
    userId: number,
    passwordDto: ChangePasswordRequestDto,
  ): Promise<ResultModelResponseDto> {
    const user = await this.getUserById(userId);
    await this.verifyPasswordWithHash(
      passwordDto.oldPassword,
      user.passwordHash,
      this.passwordPepper,
    );
    this.checkPasswordConfirmation(
      passwordDto.newPassword,
      passwordDto.confirmNewPassword,
    );
    user.passwordHash = await this.hashPassword(
      passwordDto.confirmNewPassword,
      this.passwordPepper,
    );
    await this.userRepository.save(user);
    return new ResultModelResponseDto(true, '');
  }

  async getAvailableRole(): Promise<string[]> {
    const roles = await this.roleRepository.find({
      where: {
        name: Not(In([RoleEnum.SuperAdmin, RoleEnum.Admin])),
      },
    });
    return roles.map((role) => role.name);
  }

  private async createRolesIfNotExist(): Promise<void> {
    try {
      const existingRoles = await this.roleRepository.find();
      const existingRoleNames = new Set(existingRoles.map((role) => role.name));
      for (const key in RoleEnum) {
        const roleName = RoleEnum[key];
        if (existingRoleNames.has(roleName)) continue;
        const newRole = new RoleEntity();
        newRole.name = roleName;
        await this.roleRepository.save(newRole);
      }
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('relation "role" does not exist')
      ) {
        console.error('Role table does not exist. Please run the migrations.');
      } else {
        throw error;
      }
    }
  }

  private async createAdminIfNotExist(): Promise<void> {
    const defaultSuperAdminUsername = this.configService.get<string>(
      'SUPER_ADMIN_USERNAME',
    );
    const defaultSuperAdminPassword = this.configService.get<string>(
      'SUPER_ADMIN_PASSWORD',
    );
    const admin = await this.getUserByEmail(
      defaultSuperAdminUsername.toLowerCase(),
    );

    const superAdminRole = await this.getRoleByName(RoleEnum.SuperAdmin);

    if (admin) {
      if (admin.passwordHash.trim() === '') {
        admin.passwordHash = await this.hashPassword(
          defaultSuperAdminPassword,
          this.passwordPepper,
        );
        admin.roles = new Array(superAdminRole);
        this.userRepository.save(admin);
      }
      return;
    }

    const newSuperAdmin = new User();
    newSuperAdmin.passwordHash = await this.hashPassword(
      defaultSuperAdminPassword,
      this.passwordPepper,
    );

    newSuperAdmin.fullName = 'Super Admin';
    newSuperAdmin.email = defaultSuperAdminUsername;
    newSuperAdmin.roles = new Array(superAdminRole);

    this.userRepository.save(newSuperAdmin);
  }

  private async getRoleByName(name: string): Promise<RoleEntity> {
    return await this.roleRepository.findOne({ where: { name } });
  }

  private async hashPassword(password: string, pepper: string) {
    const salt = crypto.randomBytes(16);
    const secret = Buffer.from(pepper);
    return await argon2.hash(password, { salt, secret });
  }

  private async verifyPasswordWithHash(
    password: string,
    hash: string,
    pepper: string,
  ) {
    const secret = Buffer.from(pepper);
    const isValidPassword = await argon2.verify(hash, password, { secret });
    if (!isValidPassword) throw new AppBadRequestException('PASSWORD_INVALID');
    return;
  }

  private sendVerifyEmail(name: string, email: string) {
    const payload = { name, email };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.verifyEmailExpiry,
    });
    const baseUrl = this.configService.get<string>('BASE_URL');
    const url = `${baseUrl}/${this.verifyEmailUrl}/${token}`;
    const text = `
    Dear ${name},
    
    To verify your email and set your password, please click on the following link:
    ${url}
    
    Thank you.
    Multiwarehouse App
    `;
    return this.emailService.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Multiwarehouse App - Verify Your Email',
      text,
    });
  }

  private sendForgotPasswordEmail(name: string, email: string) {
    const payload = { name, email };
    const baseUrl = this.configService.get<string>('BASE_URL');
    const token = this.jwtService.sign(payload, {
      expiresIn: this.forgotPasswordExpiry,
    });
    const url = `${baseUrl}/${this.forgotPasswordUrl}/${token}`;
    const text = `
    Dear ${name},
    
    To change your password, please click on the following link:
    ${url}
    
    Thank you.
    Multiwarehouse App
    `;

    return this.emailService.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Forgot Password',
      text,
    });
  }

  private async decodeJWTForgotPasswordToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.forgotPasswordSecret,
      });
      return payload.email;
    } catch (error) {
      if (error.name === 'TokenExpiredError')
        throw new AppBadRequestException('Token expired');
      throw new AppBadRequestException('Bad confirmation token');
    }
  }

  private checkPasswordConfirmation(
    password: string,
    confirmPassword: string,
  ): void {
    if (password !== confirmPassword) {
      throw new AppBadRequestException('CONFIRM_PASSWORD_INVALID');
    }
  }

  private async checkEmailValidity(email: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) throw new AppBadRequestException('Email already exist.');
  }

  private convertToUserProfileResponse(user: User): UserProfileResponseDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles.map((role) => role.name),
    };
  }
}