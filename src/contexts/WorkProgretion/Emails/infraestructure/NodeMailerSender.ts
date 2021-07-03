import nodemailer, { Transporter } from 'nodemailer';
import { Sender } from '../domain/Sender';

export class NodeMailerSender implements Sender {
	public sender: string;
	private password: string;
	private port: number;
	private transporter: Transporter;

	constructor(mailerData: any) {
		this.sender = mailerData.email;
		this.password = mailerData.password;
		this.port = mailerData.port;
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			port: this.port,
			host: 'smtp.gmail.com',
			secure: false,
			auth: {
				user: this.sender,
				pass: this.password,
			},
		});
	}
	public async send(reciver: string, subject: string, content: string): Promise<void> {
		await this.transporter.sendMail({
			to: reciver,
			from: this.sender,
			subject: subject,
			html: content,
		});
	}
}
