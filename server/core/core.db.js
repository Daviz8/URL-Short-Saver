import dotenv from 'dotenv';
dotenv.config();

const pass =  process.env.PASSWORD; 
const PORT = process.env.PORT

import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "short",
    password: "Money123" ,
    port: 5432,
});




export default db;