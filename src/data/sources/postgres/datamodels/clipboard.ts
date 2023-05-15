import { DataModelUser, DataModelClipboard, DbOnly } from "./datamodel";
import userModel from "./user";

import { IClipboard, Clipboard } from "../../../../domain/entities/clipboard";

type IDataModelClipboard = Omit<DataModelClipboard, DbOnly>;

interface IDataModelClipboardWithUser extends IDataModelClipboard {
  user: DataModelUser;
}

function toClipboard(data: IDataModelClipboardWithUser): IClipboard {
  return new Clipboard({
    id: data.id,
    title: data.title || undefined,
    content: data.content,
    expiration: data.expiration || undefined,
    user: userModel.toUser(data.user),
  });
}

function toClipboards(data: IDataModelClipboardWithUser[]): IClipboard[] {
  return data.map((dat) => toClipboard(dat));
}

export default {
  toClipboard,
  toClipboards,
};
