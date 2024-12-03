import { getCustomSession } from '../sessionCode.js';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

export async function POST(req) {
    const session = await getCustomSession();
    const body = await req.json();

    const { username, password } = body;

    if (!username || !password) {
        return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
    }

    const url = process.env.DB_ADDRESS;
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db('app1');
        const collection = db.collection('login');

        // Find the user by username
        const user = await collection.findOne({ username });
        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }

        // Compare password with the hashed password
        const isValidPassword = bcrypt.compareSync(password, user.pass);
        if (!isValidPassword) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }

        // Set session data
        session.email = user.username;
        session.acc_type = user.acc_type;
        session.loggedIn = true;
        await session.save();

        console.log("User logged in:", { email: user.username, acc_type: user.acc_type });

        return new Response(
            JSON.stringify({ message: 'Login successful', acc_type: user.acc_type }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during login:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    } finally {
        await client.close();
    }
}
