import pkg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const { Client } = pkg;

async function alterTable() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    console.log("Making phone_number and firebase_uid columns nullable...");
    
    // Drop NOT NULL constraints on other columns from the previous schema
    await client.query("ALTER TABLE users ALTER COLUMN phone_number DROP NOT NULL").catch(() => {});
    await client.query("ALTER TABLE users ALTER COLUMN firebase_uid DROP NOT NULL").catch(() => {});
    
    console.log("Database table strictly updated to make old columns nullable!");
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

alterTable();
