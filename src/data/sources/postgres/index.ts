import { PrismaClient as DbDriver } from "@prisma/client";
import { newDataLinkUser } from "./data-links/user";
import { newDataLinkGroup } from "./data-links/group";
import { newDataLinkClipboard } from "./data-links/clipboard";

export default new DbDriver();

export { newDataLinkUser, newDataLinkGroup, newDataLinkClipboard };

// Client for file schema.prisma
class BasePrismaSchemaDataLink {
  protected readonly db: DbDriver;

  constructor(db: DbDriver) {
    this.db = db;
  }
}

export { DbDriver, BasePrismaSchemaDataLink };
