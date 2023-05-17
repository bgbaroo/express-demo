import { PrismaClient as DbDriver } from "@prisma/client";

// Client for file schema.prisma
class BasePrismaSchemaDataLink {
  protected readonly db: DbDriver;

  constructor(db: DbDriver) {
    this.db = db;
  }
}

export { DbDriver, BasePrismaSchemaDataLink };

export default new DbDriver();
