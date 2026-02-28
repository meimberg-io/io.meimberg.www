import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET

function checkSecret(secret: string | null) {
  if (!REVALIDATE_SECRET) return true
  return secret === REVALIDATE_SECRET
}

async function handleRevalidate(secret: string | null) {
  if (!checkSecret(secret)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  await revalidatePath('/')

  return new Response(JSON.stringify({ status: 'ok', revalidated: '/' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  return handleRevalidate(secret)
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
    || req.headers.get('x-revalidate-secret')
  return handleRevalidate(secret)
}
