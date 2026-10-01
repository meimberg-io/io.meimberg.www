const BREVO_DOI_API = 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation'

export async function POST(req: Request) {
  const apiKey = process.env.BREVO_API_KEY
  const listId = Number(process.env.BREVO_LIST_ID)
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID)
  const redirectionUrl = process.env.BREVO_DOI_REDIRECT_URL
  if (!apiKey || !listId || !templateId || !redirectionUrl) {
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

  // Brevo schickt die Bestätigungsmail; erst nach dem Klick landet der Kontakt in der Liste.
  const res = await fetch(BREVO_DOI_API, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      email,
      includeListIds: [listId],
      templateId,
      redirectionUrl
    })
  })

  // 201 = neuer Kontakt, 204 = bestehender Kontakt, Bestätigungsmail geht trotzdem raus
  if (res.status === 201 || res.status === 204) {
    return Response.json({ success: true })
  }

  if (res.status === 400) {
    const data = await res.json().catch(() => ({}))
    const msg =
      data.code === 'duplicate_request'
        ? 'Diese E-Mail ist bereits angemeldet.'
        : 'Diese E-Mail ist bereits angemeldet oder ungültig.'
    return Response.json({ error: msg }, { status: 400 })
  }

  return Response.json(
    { error: 'Anmeldung fehlgeschlagen. Bitte später erneut versuchen.' },
    { status: 500 }
  )
}
