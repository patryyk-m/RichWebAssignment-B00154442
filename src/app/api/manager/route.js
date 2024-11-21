import { MongoClient } from 'mongodb';
import { getCustomSession } from '../sessionCode.js';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await getCustomSession();

    if (!session.loggedIn || session.acc_type !== 'manager') {
      return NextResponse.json({ error: 'Unauthorized. Only managers can access this resource.' }, { status: 403 });
    }

    const url = process.env.DB_ADDRESS;
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db('app1');
    const ordersCollection = db.collection('orders');

    const orders = await ordersCollection.find({}).toArray();

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
