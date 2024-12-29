import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export default class EmailService {
  private nodeMailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodeMailerTransport = createTransport({
      host: configService.get<string>('EMAIL_SERVICE'),
      port: configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: configService.get<string>('EMAIL_USER'),
        pass: configService.get<string>('EMAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
      pool: true,
      maxConnections: 1,
      maxMessages: 7,
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodeMailerTransport.sendMail(options);
  }
}
