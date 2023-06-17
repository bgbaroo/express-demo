import { PrismaClient as DbDriver } from "@prisma/client";

// This Prisma connection will be cached,
// all files importing this module will have exactly
// the same object. See Node.js reference here.
// https://nodejs.org/api/modules.html#caching
export default new DbDriver();

// Client for file schema.prisma
class BasePrismaSchemaDataLink {
  protected readonly db: DbDriver;

  constructor(db: DbDriver) {
    this.db = db;
  }
}

export { DbDriver, BasePrismaSchemaDataLink };
