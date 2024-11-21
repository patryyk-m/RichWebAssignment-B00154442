import { MongoClient } from 'mongodb';
import { getCustomSession } from '../sessionCode.js';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await getCustomSession();

    if (!session.loggedIn) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const email = session.email;
    const url = process.env.DB_ADDRESS;
    const client = new MongoClient(url);

    await client.connect();

    const db = client.db('app1');
    const cartCollection = db.collection('shopping_cart');

    const cartItems = await cartCollection.find({ email }).toArray();

    // ensure price is a number and calculate the total
    cartItems.forEach(item => {
      item.price = parseFloat(item.price) || 0; 
    });

    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

    return NextResponse.json({ items: cartItems, total: totalPrice });
  } catch (error) {
    console.error('Error in /viewCart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
