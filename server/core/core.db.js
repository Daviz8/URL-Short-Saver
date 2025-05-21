import dotenv from 'dotenv';
dotenv.config();

const pass =  process.env.PASSWORD; 
const PORT = process.env.PORT

import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "short",
    password: pass ,
    port: PORT,
});




export default db;