import { DbDriver, BasePrismaSchemaDataLink } from "./link";
import model from "../data-models/clipboard";
import userModel from "../data-models/user";

import { IClipboard } from "../../../../domain/entities/clipboard";

export class DataLinkClipboard extends BasePrismaSchemaDataLink {
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
          user: {
            connect: { id: clipboard.getUserId() },
          },
        },
      })
      .then((result) => Promise.resolve(model.toClipboard(result)))
      .catch((err) => Promise.reject(`failed to create clipboard: ${err}`));
  }

  async getUserClipboard(
    id: string,
    userId: string,
  ): Promise<IClipboard | null> {
    return this.db.clipboard
      .findFirst({
        include: {
          user: {
            include: userModel.includeGroupsAndOwnGroups(),
          },
        },
        where: {
          id,
          userId,
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

  async getUserClipboards(userId: string): Promise<IClipboard[] | null> {
    return this.db.clipboard
      .findMany({
        include: {
          user: {
            include: userModel.includeGroupsAndOwnGroups(),
          },
        },
        where: {
          userId,
        },
      })
      .then((result) => {
        if (!result) {
          return Promise.resolve(null);
        }

        return Promise.resolve(model.toClipboards(result));
      })
      .catch((err) => Promise.reject(`failed to get user clipboards: ${err}`));
  }

  async getUserGroupClipboard(
    id: string,
    userId: string,
    groupId: string,
  ): Promise<IClipboard | null> {
    return this.db.clipboard
      .findFirst({
        include: {
          user: {
            include: userModel.includeGroupsAndOwnGroups(),
          },
        },
        where: {
          id,
          userId,
          user: {
            groups: {
              some: {
                id: groupId,
              },
            },
          },
        },
      })
      .then((result) => {
        if (!result) {
          return Promise.resolve(null);
        }

        return Promise.resolve(model.toClipboard(result));
      })
      .catch((err) =>
        Promise.reject(`failed to get user's group clipboard: ${err}`),
      );
  }

  async getGroupClipboards(
    groupId: string,
    userId?: string,
  ): Promise<IClipboard[] | null> {
    return this.db.clipboard
      .findMany({
        include: {
          user: {
            include: userModel.includeGroupsAndOwnGroups(),
          },
        },
        where: {
          user: {
            groups: {
              some: {
                id: groupId,
                users: {
                  some: {
                    id: userId,
                  },
                },
              },
            },
          },
        },
      })
      .then((result) => {
        if (!result) {
          return Promise.resolve(null);
        }

        return Promise.resolve(model.toClipboards(result));
      })
      .catch((err) => Promise.reject(`failed to get group clipboards: ${err}`));
  }

  async deleteClipboard(id: string): Promise<IClipboard> {
    return this.db.clipboard
      .delete({
        include: {
          user: {
            include: userModel.includeGroupsAndOwnGroups(),
          },
        },
        where: {
          id,
        },
      })
      .then((result) => Promise.resolve(model.toClipboard(result)))
      .catch((err) => Promise.reject(`failed to delete clipboard: ${err}`));
  }

  async deleteUserClipboards(userId: string): Promise<number> {
    return this.db.clipboard
      .deleteMany({
        where: {
          user: {
            id: userId,
          },
        },
      })
      .then((result) => Promise.resolve(result.count))
      .catch((err) => Promise.reject(`failed to delete clipboard: ${err}`));
  }
}
