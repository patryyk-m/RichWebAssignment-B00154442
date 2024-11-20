import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
  console.log("In the getProducts API page");

  try {

    const url = "mongodb+srv://root:root@cluster0.5ibf2.mongodb.net/app1?retryWrites=true&w=majority"

    const client = new MongoClient(url);


    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db();
    const collection = db.collection('products');


    const findResult = await collection.find({}).toArray();

    console.log('Found documents =>', findResult);


    return NextResponse.json(findResult);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
