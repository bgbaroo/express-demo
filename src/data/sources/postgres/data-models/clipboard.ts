import { DataModelClipboard, DbOnly } from "./models";
import userModel, { AppDataModelUserWithGroups } from "./user";

import { IClipboard, Clipboard } from "../../../../domain/entities/clipboard";

type IDataModelClipboard = Omit<DataModelClipboard, DbOnly>;

interface IDataModelClipboardWithUser extends IDataModelClipboard {
  user: AppDataModelUserWithGroups;
}

function toClipboard(data: IDataModelClipboardWithUser): IClipboard {
  return new Clipboard({
    id: data.id,
    title: data.title || undefined,
    content: data.content,
    shared: data.shared,
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
