import { DataModelUser, DataModelClipboard, DbOnly } from "./db-only";
import adapterUser from "./user";

import {
  IClipboard,
  Clipboard,
} from "../../../../../domain/entities/clipboard";

type IDataModelClipboard = Omit<DataModelClipboard, DbOnly>;

interface IDataModelClipboardWithUser extends IDataModelClipboard {
  user: DataModelUser;
}

function dataModelClipboardToClipboard(
  data: IDataModelClipboardWithUser,
): IClipboard {
  return new Clipboard({
    id: data.id,
    title: data.title || undefined,
    content: data.content,
    expiration: data.expiration || undefined,
    user: adapterUser.dataModelUserToIUser(data.user),
  });
}

function dataModelClipboardsToClipboards(
  data: IDataModelClipboardWithUser[],
): IClipboard[] {
  return data.map((dat) => dataModelClipboardToClipboard(dat));
}

export default {
  dataModelClipboardToClipboard,
  dataModelClipboardsToClipboards,
};
