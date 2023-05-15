import { DbDriver, BasePrismaSchemaDataLink } from "./prisma-postgres";
import model from "../datamodels/clipboard";

import { IClipboard } from "../../../../domain/entities/clipboard";

export class DataLinkClipboard extends BasePrismaSchemaDataLink {
  constructor(db: DbDriver) {
    super(db);
  }

  async createClipboard(clipboard: IClipboard): Promise<IClipboard> {
    return this.db.clipboard
      .create({
        include: {
          user: true,
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
          user: true,
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
          user: true,
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
          user: true,
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

  async getGroupClipboards(groupId: string): Promise<IClipboard[] | null> {
    return this.db.clipboard
      .findMany({
        include: {
          user: true,
        },
        where: {
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

        return Promise.resolve(model.toClipboards(result));
      })
      .catch((err) => Promise.reject(`failed to get group clipboards: ${err}`));
  }
}
