import { MongoClient } from 'mongodb';
import { getCustomSession } from '../sessionCode.js';
import { NextResponse } from 'next/server';

export async function GET(req) {
  console.log("In the putInCart API page");

  const { searchParams } = new URL(req.url);
  const pname = searchParams.get('pname'); // Extract product name from the query string

  console.log("Product Name:", pname);

  try {
    // Get session data
    const session = await getCustomSession();

    if (!session.loggedIn) {
      // If user is not logged in return an unauthorized response
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const email = session.email; // Retrieve email from session
    console.log("Session Email:", email);

    const url = process.env.DB_ADDRESS;
    const client = new MongoClient(url);

    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db('app1'); 
    const productsCollection = db.collection('products'); 
    const cartCollection = db.collection('shopping_cart');

    // Fetch the product from the products collection
    const product = await productsCollection.findOne({ pname });
    if (!product) {
      return NextResponse.json({ error: `Product "${pname}" not found` }, { status: 404 });
    }

    const myobj = {
      pname,
      price: product.price, // Add price fetched from products collection
      email, // Add the logged-in user's email
    };

    // Insert the product into the shopping cart collection
    const insertResult = await cartCollection.insertOne(myobj);
    console.log("Insert result:", insertResult);

    return NextResponse.json({ data: "Inserted successfully", item: myobj });
  } catch (error) {
    console.error('Error inserting into the shopping cart:', error);
    return NextResponse.json({ error: "Failed to insert" }, { status: 500 });
  }
}
