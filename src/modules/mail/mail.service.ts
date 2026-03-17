import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendOtp(email: string, otp: string) {
    await this.transporter.sendMail({
      from: "AtlasFX",
      to: email,
      subject: 'Your OTP Code',
      html: `<h3>Your OTP is: ${otp}</h3><p>Expires in 5 minutes</p>`,
    });
  }
}