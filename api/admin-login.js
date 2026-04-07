import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// ─── JWT helpers (zero-dependency, Node.js crypto) ─────────────
function createToken(payload, secret, maxAgeSec) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const now = Math.floor(Date.now() / 1000)
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now, exp: now + maxAgeSec })).toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${signature}`
}

// ─── Rate limiting (in-memory, per warm instance) ──────────────
const attempts = new Map()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const BLOCK_MS = 30 * 60 * 1000  // 30 minutes block after max attempts

function getRateLimitKey(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         'unknown'
}

function checkRateLimit(ip) {
  const now = Date.now()
  const record = attempts.get(ip)
  if (!record) return { allowed: true }
  // Clean old entries
  if (now - record.windowStart > WINDOW_MS) {
    attempts.delete(ip)
    return { allowed: true }
  }
  if (record.blocked && now < record.blockedUntil) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000)
    return { allowed: false, retryAfter }
  }
  if (record.blocked && now >= record.blockedUntil) {
    attempts.delete(ip)
    return { allowed: true }
  }
  return { allowed: true }
}

function recordFailedAttempt(ip) {
  const now = Date.now()
  const record = attempts.get(ip) || { count: 0, windowStart: now }
  record.count++
  if (record.count >= MAX_ATTEMPTS) {
    record.blocked = true
    record.blockedUntil = now + BLOCK_MS
  }
  attempts.set(ip, record)
}

function clearAttempts(ip) {
  attempts.delete(ip)
}

// ─── Handler ───────────────────────────────────────────────────
const SESSION_MAX_AGE = 8 * 60 * 60 // 8 hours

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ADMIN_PIN_HASH = process.env.ADMIN_PIN_HASH
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET

  if (!ADMIN_PIN_HASH || !JWT_SECRET) {
    console.error('Missing ADMIN_PIN_HASH or ADMIN_JWT_SECRET env vars')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // Rate limiting
  const ip = getRateLimitKey(req)
  const rateCheck = checkRateLimit(ip)
  if (!rateCheck.allowed) {
    res.setHeader('Retry-After', rateCheck.retryAfter)
    return res.status(429).json({
      error: 'Demasiados intentos. Intenta de nuevo más tarde.',
      retryAfter: rateCheck.retryAfter,
    })
  }

  // Parse body
  let pin
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    pin = body?.pin
  } catch {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({ error: 'PIN requerido' })
  }

  // Anti brute-force delay (always wait a bit)
  await new Promise(resolve => setTimeout(resolve, 500))

  // Validate PIN against hash
  const valid = await bcrypt.compare(pin, ADMIN_PIN_HASH)

  if (!valid) {
    recordFailedAttempt(ip)
    // Extra delay on failure
    await new Promise(resolve => setTimeout(resolve, 1000))
    return res.status(401).json({ error: 'PIN incorrecto' })
  }

  // Success — clear rate limit and create session
  clearAttempts(ip)
  const token = createToken({ role: 'admin' }, JWT_SECRET, SESSION_MAX_AGE)

  const isSecure = req.headers['x-forwarded-proto'] === 'https'
  const cookieValue = [
    `rm-admin-session=${token}`,
    'HttpOnly',
    isSecure ? 'Secure' : '',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${SESSION_MAX_AGE}`,
  ].filter(Boolean).join('; ')

  res.setHeader('Set-Cookie', cookieValue)
  return res.status(200).json({ ok: true })
}
