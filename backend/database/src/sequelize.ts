import { Sequelize } from "sequelize";
import cls from "cls-hooked";

const namespace = cls.createNamespace("sequelize-namespace");
(Sequelize as any).useCLS(namespace);

const {
  DB_HOST = "postgres",
  DB_PORT = "5432",
  DB_NAME = "lms",
  DB_USER = "lms",
  DB_PASSWORD = "lms_password"
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "postgres",
  logging: process.env.DB_LOGGING === "true" ? console.log : false
});

export default sequelize;

