import { PrismaClient } from "@prisma/client";

export type DbDriver = PrismaClient;

export class BasePrismaSchemaDataLink {
  protected readonly db: DbDriver;

  constructor(db: DbDriver) {
    this.db = db;
  }
}
