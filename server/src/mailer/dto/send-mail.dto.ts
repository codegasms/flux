export class SendMailDto {
  recipients: string[];
  subject: string;
  text: string;
  html?: string;
}
