export interface IClipboard {
  id: string;
  title?: string;
  content: string;
  userId: string;
  expiration?: Date;
}
