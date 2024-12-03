import { getCustomSession } from '../sessionCode.js';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

export async function POST(req) {
    const session = await getCustomSession();
    const body = await req.json();
    const { username, password } = body;

    // Basic server-side validation
    if (!username || !password) {
        return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
    }

    const client = new MongoClient(process.env.DB_ADDRESS);
    try {
        await client.connect();

        const db = client.db('app1');
        const collection = db.collection('login');

        // check if email is already registered
        if (await collection.findOne({ username })) {
            return new Response(JSON.stringify({ error: 'Email is already registered' }), { status: 400 });
        }

        // hash the password and store it in the database
        const hashedPassword = bcrypt.hashSync(password, 10); // 10 salt rounds
        const newUser = {
            username,
            pass: hashedPassword,
            acc_type: 'customer',
        };
        await collection.insertOne(newUser);

        // Set session data
        session.email = username;
        session.loggedIn = true;
        await session.save();

        console.log('User registered:', { username, acc_type: 'customer' });
        return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error during registration:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    } finally {
        await client.close();
    }
}
