import { User as DataModelUser, Group as DataModelGroup } from "@prisma/client";

type DbOnly = "createdAt" | "updatedAt";

export { DataModelUser, DataModelGroup, DbOnly };
