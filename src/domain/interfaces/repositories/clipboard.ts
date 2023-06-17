import { IClipboard } from "../../entities/clipboard";

export interface IRepositoryClipboard {
  createClipboard(clipboard: IClipboard): Promise<IClipboard>;

  // Get all user clipboards
  getUserClipboards(userId: string): Promise<IClipboard[] | null>;
  // Get user clipboard by id
  getUserClipboard(arg: {
    userId: string;
    id: string;
  }): Promise<IClipboard | null>;

  // Get shared clipboards from user's groups
  getUserGroupsClipboards(userId: string): Promise<IClipboard[] | null>;
  // Get shared clipboards from a user's group
  getUserGroupClipboards(
    userId: string,
    groupId: string,
  ): Promise<IClipboard[] | null>;

  // Get shared clipboards from a user's group
  getGroupClipboards(groupId: string): Promise<IClipboard[] | null>;

  deleteUserClipboard(arg: { userId: string; id: string }): Promise<IClipboard>;
  deleteUserClipboards(userId: string): Promise<number>;
}

export interface IWhereClipboard {
  id?: string;
  userId?: string;
  shared?: boolean;
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

export function whereUserId(userId: string): IWhereClipboard {
  return { userId };
}

export function whereClipboard(arg: {
  clipboardId?: string;
  userId?: string;
  shared?: boolean;
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
      shared: arg.shared,
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
      shared: arg.shared,
      id: arg.clipboardId,
      userId: arg.userId,
    };
  }

  return {
    // User's own clipboards from group groupId
    id: arg.clipboardId,
    userId: arg.userId,
    shared: arg.shared,
    user: {
      groups: {
        some: {
          id: arg.groupId,
        },
      },
    },
  };
}
