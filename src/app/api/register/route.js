import { getCustomSession } from '../sessionCode.js';
import { MongoClient } from 'mongodb';

export async function POST(req) {
    const session = await getCustomSession();
    const body = await req.json(); 

    const { username, password } = body;

    // Validation for email and password
    if (!username || !password) {
        return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
    }

    // Validate that the username is a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
        return new Response(JSON.stringify({ error: 'Invalid email format. It must contain "@" and "."' }), { status: 400 });
    }

    try {
        // Connect to MongoDB
        const url = process.env.DB_ADDRESS; 
        const client = new MongoClient(url);
        await client.connect();

        const db = client.db('app1'); 
        const collection = db.collection('login');

        // Check if the email already exists
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'Email is already registered' }), { status: 400 });
        }

        // Insert the new user into the 'login' collection
        const newUser = {
            username, // Email as username
            pass: password, // Password - i should hash this
            acc_type: 'customer', 
        };
        await collection.insertOne(newUser);

        // Set session data
        session.email = username; // Save the email in the session
        session.loggedIn = true;
        await session.save();

        console.log('User registered:', { username, acc_type: 'customer' });

        return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error registering user:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
