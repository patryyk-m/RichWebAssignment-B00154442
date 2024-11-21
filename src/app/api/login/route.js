import { getCustomSession } from '../sessionCode.js';
import { MongoClient } from 'mongodb';

export async function POST(req) {
  const session = await getCustomSession();
  const body = await req.json();

  const url = process.env.DB_ADDRESS;
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db('app1');
    const collection = db.collection('login');

    // Validate user credentials
    const user = await collection.findOne({ username: body.username, pass: body.password });

    if (user) {
    session.email = user.username; // save to session
    session.acc_type = user.acc_type;
    session.loggedIn = true;
    await session.save();

    return new Response(
        JSON.stringify({ message: 'Login successful', acc_type: user.acc_type }),
        { status: 200 }
    );

    } else {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  } finally {
    await client.close();
  }
}
