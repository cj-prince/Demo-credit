import knex from "knex";
import { knexConfig } from "./database";


const environment = process.env.DEMOCREDIT_NODE_ENV || "development";
const connection = knex(knexConfig[environment]);


export {connection};
