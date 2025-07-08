import { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';

const uri = process.env.MONGODB_URI;

export async function createUser(email, hashedPassword) {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db('test');
    const usersCollection = db.collection('users');

    await usersCollection.insertOne({ email, password: hashedPassword });

    return { success: true, message: 'User created successfully' };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('An error occurred during user creation');
  } finally {
    await client.close();
  }
}
