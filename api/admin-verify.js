import crypto from 'crypto'

// ─── JWT verify (zero-dependency) ──────────────────────────────
function verifyToken(token, secret) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [header, body, signature] = parts
    const expectedSig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {}
  return Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...val] = c.trim().split('=')
      return [key, val.join('=')]
    })
  )
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const JWT_SECRET = process.env.ADMIN_JWT_SECRET
  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const cookies = parseCookies(req.headers.cookie)
  const token = cookies['rm-admin-session']

  if (!token) {
    return res.status(401).json({ authenticated: false })
  }

  const payload = verifyToken(token, JWT_SECRET)
  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({ authenticated: false })
  }

  return res.status(200).json({ authenticated: true })
}
