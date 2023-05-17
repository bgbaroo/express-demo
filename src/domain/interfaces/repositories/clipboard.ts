import { IClipboard } from "../../entities/clipboard";

export interface IWhereClipboard {
  id?: string;
  userId?: string;
  user?: {
    groups?: {
      some?: {
        id?: string;
        users?: {
          some?: {
            id?: string;
          };
        };
      };
    };
  };
}

export function whereClipboard(arg: {
  clipboardId?: string;
  userId?: string;
  groupId?: string;
  allGroups?: boolean; // For getting all clipboards from groups whose members include userId
}): IWhereClipboard | undefined {
  if (arg.allGroups) {
    if (!arg.userId) {
      console.error(`bad where clipboard - allGroups but missing userId`);
      return undefined;
    }

    // All clipboards from groups whose members include userId
    return {
      user: {
        groups: {
          some: {
            users: {
              some: {
                id: arg.userId,
              },
            },
          },
        },
      },
    };
  }

  if (!arg.groupId) {
    // User clipboard(s)
    return {
      id: arg.clipboardId,
      userId: arg.userId,
    };
  }

  return {
    // User's own clipboards from group groupId
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
  getGroupsClipboards(userId: string): Promise<IClipboard[] | null>;
  deleteUserClipboard(userId: string, id: string): Promise<IClipboard>;
  deleteUserClipboards(userId: string): Promise<number>;
}
