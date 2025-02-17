import { MongoClient,Db, Collection } from 'mongodb';
import Verification from '../models/verifications';
import Users from '../models/users';

export const collections: {
    verification?: Collection<Verification>,
    users?: Collection<Users>,
} = {}

export async function connectToDatabase () {
    const client: MongoClient = new MongoClient(process.env.DB_URI as string);
            
    await client.connect();
        
    const db: Db = client.db(process.env.DB_NAME);
 
    collections.verification = db.collection("verifications");
    collections.users = db.collection("users");
       
    console.log(`Successfully connected to database: ${db.databaseName}`);
}