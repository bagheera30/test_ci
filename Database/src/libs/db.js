import { PrismaClient } from "@prisma/client";

class db {
  private;

  static instance;
  constructor() {}

  public;

  static getInstance() {
    if (!this.instance) {
      this.instance = PrismaClient();
    }
    return this.instance;
  }
}
module.exports = db;
const prisma = db.getInstance();
