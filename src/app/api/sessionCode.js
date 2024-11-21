
import { getIronSession } from 'iron-session';

import { cookies } from 'next/headers'


export async function getCustomSession(){



    console.log("loading session stuff")

    let pw = process.env.SESSION_SECRET || "VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf"

    const session = await getIronSession(cookies(), { password: pw, cookieName: "app1" });


   

    return session


}