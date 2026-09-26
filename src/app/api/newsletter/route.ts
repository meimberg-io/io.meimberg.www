const BUTTONDOWN_API = 'https://api.buttondown.com/v1/subscribers'

export async function POST(req: Request) {
  const apiKey = process.env.BUTTONDOWN_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: 'Newsletter-Anmeldung ist nicht konfiguriert.' },
      { status: 500 }
    )
  }

  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json(
      { error: 'Ungültige Anfrage.' },
      { status: 400 }
    )
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { error: 'Bitte eine gültige E-Mail-Adresse angeben.' },
      { status: 400 }
    )
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    undefined

  const res = await fetch(BUTTONDOWN_API, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email_address: email,
      ...(ip && { ip_address: ip })
    })
  })

  const data = await res.json().catch(() => ({}))

  if (res.status === 201) {
    return Response.json({ success: true })
  }

  if (res.status === 400) {
    const msg =
      data.email_address?.[0] ||
      data.detail ||
      'Diese E-Mail ist bereits angemeldet oder ungültig.'
    return Response.json({ error: msg }, { status: 400 })
  }

  return Response.json(
    { error: 'Anmeldung fehlgeschlagen. Bitte später erneut versuchen.' },
    { status: 500 }
  )
}
