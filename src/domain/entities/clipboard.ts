export interface IClipboard {
  id: string;
  content: string;
  userId: string;
  // Optional
  title: string | undefined;
  expiration: Date | undefined;
}
