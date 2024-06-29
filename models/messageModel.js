import { MongoClient } from 'mongodb';

const url = "mongodb://localhost:27017";
const dbName = "ollama";
let db;

export async function connectDB() {
  try {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
    console.log("Conectado a la base de datos MongoDB");
  } catch (error) {
    console.error("Error conectando a la base de datos:", error);
  }
}

export function getDB() {
  return db;
}
