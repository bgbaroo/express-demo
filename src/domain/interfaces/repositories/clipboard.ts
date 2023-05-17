import { IClipboard } from "../../entities/clipboard";

export interface IWhereClipboard {
  id?: string;
  userId?: string;
  user?: {
    groups: {
      some: {
        id: string;
      };
    };
  };
}
export function whereClipboard(arg: {
  clipboardId?: string;
  userId?: string;
  groupId?: string;
}): IWhereClipboard {
  if (!arg.groupId) {
    return {
      id: arg.clipboardId,
      userId: arg.userId,
    };
  }

  return {
    id: arg.clipboardId,
    userId: arg.userId,
    user: {
      groups: {
        some: {
          id: arg.groupId,
        },
      },
    },
  };
}
export interface IRepositoryClipboard {
  createClipboard(clipboard: IClipboard): Promise<IClipboard>;
  getUserClipboard(userId: string, id: string): Promise<IClipboard | null>;
  getUserClipboards(userId: string): Promise<IClipboard[] | null>;
  getGroupClipboards(
    userId: string,
    groupId: string,
  ): Promise<IClipboard[] | null>;
  deleteUserClipboard(userId: string, id: string): Promise<IClipboard>;
  deleteUserClipboards(userId: string): Promise<number>;
}
