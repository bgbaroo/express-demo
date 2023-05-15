import {
  User as DataModelUser,
  Group as DataModelGroup,
  Clipboard as DataModelClipboard,
} from "@prisma/client";

type DbOnly = "createdAt" | "updatedAt";

export { DataModelUser, DataModelGroup, DataModelClipboard, DbOnly };
