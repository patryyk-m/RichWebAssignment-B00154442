import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
  console.log("In the putInCart API page");

  const { searchParams } = new URL(req.url);
  const pname = searchParams.get('pname');
  
  console.log("Product Name: ", pname);

  try {

    const url = process.env.DB_ADDRESS;
    const client = new MongoClient(url);


    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db();
    const collection = db.collection('shopping_cart');


    const myobj = { pname: pname, username: "sample@test.com" };


    const insertResult = await collection.insertOne(myobj);
    console.log("Insert result:", insertResult);


    return NextResponse.json({ data: "Inserted successfully" });

  } catch (error) {
    console.error('Error inserting into the shopping cart:', error);
    return NextResponse.json({ error: "Failed to insert" }, { status: 500 });
  }
}
