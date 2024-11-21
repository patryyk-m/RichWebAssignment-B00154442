import { MongoClient } from 'mongodb';
import { getCustomSession } from '../sessionCode.js';
import { NextResponse } from 'next/server';

export async function POST(req) {
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
    const ordersCollection = db.collection('orders');

    // fetch items from the shopping cart
    const cartItems = await cartCollection.find({ email }).toArray();

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    // calculate the total price
    const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);

    // insert the order into the orders collection
    const order = {
      email,
      items: cartItems,
      total: `${totalPrice} euro`,
      createdAt: new Date(),
    };

    const insertResult = await ordersCollection.insertOne(order);

    // clear the cart after checkout
    await cartCollection.deleteMany({ email });

    console.log('Order placed:', insertResult);

    return NextResponse.json({
      message: `Order placed successfully! Sending confirmation email to ${email}`,
      total: `${totalPrice} euro`,
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
