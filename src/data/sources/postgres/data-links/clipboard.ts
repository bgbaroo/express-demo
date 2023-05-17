import { DbDriver, BasePrismaSchemaDataLink } from "../";
import model from "../data-models/clipboard";
import userModel from "../data-models/user";

import { IWhereClipboard } from "../../../../domain/interfaces/repositories/clipboard";
import { IClipboard } from "../../../../domain/entities/clipboard";
import { IDataLinkClipboard } from "../../../interfaces/data-links";

export class DataLinkClipboard
  extends BasePrismaSchemaDataLink
  implements IDataLinkClipboard
{
  constructor(db: DbDriver) {
    super(db);
  }

  async createClipboard(clipboard: IClipboard): Promise<IClipboard> {
    return this.db.clipboard
      .create({
        include: {
          user: {
            include: userModel.includeGroupsAndOwnGroups(),
          },
        },
        data: {
          id: clipboard.id,
          title: clipboard.title,
          content: clipboard.content,
          shared: clipboard.shared,
          user: {
            connect: { id: clipboard.getUserId() },
          },
          expiration: clipboard.expiration,
        },
      })
      .then((result) => Promise.resolve(model.toClipboard(result)))
      .catch((err) => Promise.reject(`failed to create clipboard: ${err}`));
  }

  async getClipboard(
    where: IWhereClipboard | undefined,
  ): Promise<IClipboard | null> {
    return this.db.clipboard
      .findFirst({
        where,
        include: {
          user: {
            include: userModel.includeGroupsAndOwnGroups(),
          },
        },
      })
      .then((result) => {
        if (!result) {
          return Promise.resolve(null);
        }

        return Promise.resolve(model.toClipboard(result));
      })
      .catch((err) => Promise.reject(`failed to get user clipboard ${err}`));
  }

  async getClipboards(
    where: IWhereClipboard | undefined,
  ): Promise<IClipboard[] | null> {
    return this.db.clipboard
      .findMany({
        where,
        include: {
          user: {
            include: userModel.includeGroupsAndOwnGroups(),
          },
        },
      })
      .then((result) => {
        if (!result) {
          return Promise.resolve(null);
        }

        return Promise.resolve(model.toClipboards(result));
      })
      .catch((err) => Promise.reject(err));
  }

  async deleteClipboard(where: IWhereClipboard): Promise<IClipboard> {
    return this.db.clipboard
      .delete({
        where,
        include: {
          user: {
            include: userModel.includeGroupsAndOwnGroups(),
          },
        },
      })
      .then((result) => Promise.resolve(model.toClipboard(result)))
      .catch((err) => Promise.reject(`failed to delete clipboard: ${err}`));
  }

  async deleteClipboards(where: IWhereClipboard): Promise<number> {
    return this.db.clipboard
      .deleteMany({
        where,
      })
      .then((result) => Promise.resolve(result.count))
      .catch((err) => Promise.reject(`failed to delete clipboard: ${err}`));
  }
}
