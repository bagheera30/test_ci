import { PrismaClient } from "@prisma/client";

class db {
    private: any;

    static instance: PrismaClient;
    constructor() { }

    public: any;

    static getInstance(): PrismaClient {
        if (!this.instance) {
            this.instance = new PrismaClient();
        }
        return this.instance;
    }
}
module.exports = db;
const prisma = db.getInstance();