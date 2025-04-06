import {revalidatePath} from 'next/cache';

export async function POST(req: Request) {
    const token = req.headers.get('x-serviceatlas-token');
    const expectedToken = process.env.REVALIDATE_SECRET;

    if (!token || token !== expectedToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const tag = '/'; // fest definierter Tag

    await revalidatePath(tag);

    return new Response(JSON.stringify({ status: 'ok', tag }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
