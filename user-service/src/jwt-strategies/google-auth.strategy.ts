// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { GoogleUser } from 'src/user/dtos/google-user';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(
//   Strategy,
//   'google-oauth-guard',
// ) {
//   constructor(private configService: ConfigService) {
//     super({
//       clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
//       clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
//       callbackURL: configService.get<string>('GOOGLE_REDIRECT_URL'),
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     const { name, emails, photos } = profile;
//     const user: GoogleUser = {
//       email: emails[0].value,
//       firstName: name.givenName,
//       lastName: name.familyName,
//       picture: photos[0].value,
//       accessToken,
//       refreshToken,
//     };
//     done(null, user);
//   }
// }
