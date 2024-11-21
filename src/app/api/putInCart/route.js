import { MongoClient } from 'mongodb';
import { getCustomSession } from '../sessionCode.js';
import { NextResponse } from 'next/server';

export async function GET(req) {
  console.log("In the putInCart API page");

  const { searchParams } = new URL(req.url);
  const pname = searchParams.get('pname');

  console.log("Product Name:", pname);

  try {
    // Get session data
    const session = await getCustomSession();

    if (!session.loggedIn) {
      // If user is not logged in, return an unauthorized response
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const email = session.email; // Correctly retrieve email
    console.log("Session Email:", email);

    const url = process.env.DB_ADDRESS;
    const client = new MongoClient(url);

    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db('app1'); // Ensure you use the correct database name
    const collection = db.collection('shopping_cart');

    // Create the object to insert into the shopping cart
    const myobj = { pname, email };

    const insertResult = await collection.insertOne(myobj);
    console.log("Insert result:", insertResult);

    return NextResponse.json({ data: "Inserted successfully" });
  } catch (error) {
    console.error('Error inserting into the shopping cart:', error);
    return NextResponse.json({ error: "Failed to insert" }, { status: 500 });
  }
}
