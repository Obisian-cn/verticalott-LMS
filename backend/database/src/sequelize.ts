import { Sequelize } from "sequelize";
import cls from "cls-hooked";

const namespace = cls.createNamespace("sequelize-namespace");
(Sequelize as any).useCLS(namespace);

const { DATABASE_URL } = process.env;

export const sequelize = new Sequelize(DATABASE_URL as string, {
  dialect: "postgres",
  logging: process.env.DB_LOGGING === "true" ? console.log : false
});

export default sequelize;

