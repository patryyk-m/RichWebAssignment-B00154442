import { getCustomSession } from '../sessionCode.js';

export async function GET(req) {
    const session = await getCustomSession();

    const email = session.email; 
    const acc_type = session.acc_type;

    console.log({ email, acc_type });
    return new Response(JSON.stringify({ email, acc_type }), { status: 200 });
}
