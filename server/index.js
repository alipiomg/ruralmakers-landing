import express from 'express'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001

// Load env
const envPath = join(__dirname, '..', '.env')
try {
  const envContent = readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) return
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    if (key) process.env[key] = val
  })
} catch (e) { /* .env optional */ }

const GOTEO_USER = process.env.GOTEO_USER
const GOTEO_KEY = process.env.GOTEO_KEY
if (!GOTEO_USER || !GOTEO_KEY) {
  console.warn('GOTEO_USER o GOTEO_KEY no definidos en .env — el proxy de Goteo no funcionara')
}
const GOTEO_BASE = 'https://api.goteo.org/v1'

// CORS - restringido a dominios propios
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3001',
  'https://www.ruralmakers.net',
  'https://ruralmakers.net',
  'https://ruralmakers.vercel.app',
]
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', 'true')
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.use(express.json())

// ─── JWT helpers ───────────────────────────────────────────────
function createToken(payload, secret, maxAgeSec) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const now = Math.floor(Date.now() / 1000)
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now, exp: now + maxAgeSec })).toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${signature}`
}

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
  } catch { return null }
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

// ─── Rate limiting ─────────────────────────────────────────────
const attempts = new Map()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000
const BLOCK_MS = 30 * 60 * 1000
const SESSION_MAX_AGE = 8 * 60 * 60

function checkRateLimit(ip) {
  const now = Date.now()
  const record = attempts.get(ip)
  if (!record) return { allowed: true }
  if (now - record.windowStart > WINDOW_MS) { attempts.delete(ip); return { allowed: true } }
  if (record.blocked && now < record.blockedUntil) {
    return { allowed: false, retryAfter: Math.ceil((record.blockedUntil - now) / 1000) }
  }
  if (record.blocked) { attempts.delete(ip); return { allowed: true } }
  return { allowed: true }
}

function recordFailedAttempt(ip) {
  const now = Date.now()
  const record = attempts.get(ip) || { count: 0, windowStart: now }
  record.count++
  if (record.count >= MAX_ATTEMPTS) { record.blocked = true; record.blockedUntil = now + BLOCK_MS }
  attempts.set(ip, record)
}

// ─── Admin Auth API ────────────────────────────────────────────
app.post('/api/admin-login', async (req, res) => {
  const ADMIN_PIN_HASH = process.env.ADMIN_PIN_HASH
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET
  if (!ADMIN_PIN_HASH || !JWT_SECRET) {
    console.error('Missing ADMIN_PIN_HASH or ADMIN_JWT_SECRET')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown'
  const rateCheck = checkRateLimit(ip)
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: 'Demasiados intentos.', retryAfter: rateCheck.retryAfter })
  }

  const { pin } = req.body || {}
  if (!pin || typeof pin !== 'string') return res.status(400).json({ error: 'PIN requerido' })

  await new Promise(r => setTimeout(r, 500))
  const valid = await bcrypt.compare(pin, ADMIN_PIN_HASH)

  if (!valid) {
    recordFailedAttempt(ip)
    await new Promise(r => setTimeout(r, 1000))
    return res.status(401).json({ error: 'PIN incorrecto' })
  }

  attempts.delete(ip)
  const token = createToken({ role: 'admin' }, JWT_SECRET, SESSION_MAX_AGE)
  res.cookie('rm-admin-session', token, {
    httpOnly: true,
    secure: false, // localhost
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE * 1000,
  })
  res.json({ ok: true })
})

app.get('/api/admin-verify', (req, res) => {
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET
  if (!JWT_SECRET) return res.status(500).json({ error: 'Server configuration error' })
  const cookies = parseCookies(req.headers.cookie)
  const token = cookies['rm-admin-session']
  if (!token) return res.status(401).json({ authenticated: false })
  const payload = verifyToken(token, JWT_SECRET)
  if (!payload || payload.role !== 'admin') return res.status(401).json({ authenticated: false })
  res.json({ authenticated: true })
})

app.post('/api/admin-logout', (req, res) => {
  res.cookie('rm-admin-session', '', { httpOnly: true, path: '/', maxAge: 0 })
  res.json({ ok: true })
})

// ─── Newsletter Leads ──────────────────────────────────────────
import { existsSync, mkdirSync } from 'fs'
const DATA_DIR = join(__dirname, '..', '.data')
const LEADS_FILE = join(DATA_DIR, 'newsletter-leads.json')

function ensureDataDir() { if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true }) }
function readLeadsFile() {
  ensureDataDir()
  try { return JSON.parse(readFileSync(LEADS_FILE, 'utf-8')) } catch { return [] }
}
function writeLeadsFile(leads) {
  ensureDataDir()
  const { writeFileSync } = require('fs')
  writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8')
}

app.post('/api/newsletter-subscribe', (req, res) => {
  const email = req.body?.email?.trim().toLowerCase()
  const source = req.body?.source || 'landing'
  if (!email || !email.includes('@') || !email.includes('.')) return res.status(400).json({ error: 'Email no válido' })
  if (email.length > 254) return res.status(400).json({ error: 'Email demasiado largo' })

  const leads = readLeadsFile()
  if (leads.some(l => l.email === email)) return res.json({ ok: true, message: 'Ya estás suscrito/a' })

  leads.push({ email, source, subscribedAt: new Date().toISOString(), ip: req.ip || 'unknown' })
  writeLeadsFile(leads)
  res.status(201).json({ ok: true, message: 'Suscripción confirmada' })
})

app.get('/api/newsletter-subscribe', (req, res) => {
  // Verificar admin auth
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET
  if (!JWT_SECRET) return res.status(500).json({ error: 'Config error' })
  const cookies = parseCookies(req.headers.cookie)
  const token = cookies['rm-admin-session']
  if (!token) return res.status(401).json({ error: 'No autorizado' })
  const payload = verifyToken(token, JWT_SECRET)
  if (!payload || payload.role !== 'admin') return res.status(401).json({ error: 'No autorizado' })

  const leads = readLeadsFile()
  res.json({ leads, total: leads.length })
})

app.delete('/api/newsletter-subscribe', (req, res) => {
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET
  if (!JWT_SECRET) return res.status(500).json({ error: 'Config error' })
  const cookies = parseCookies(req.headers.cookie)
  const token = cookies['rm-admin-session']
  if (!token) return res.status(401).json({ error: 'No autorizado' })
  const payload = verifyToken(token, JWT_SECRET)
  if (!payload || payload.role !== 'admin') return res.status(401).json({ error: 'No autorizado' })

  const emailToDelete = req.body?.email?.trim().toLowerCase()
  const leads = readLeadsFile()
  const filtered = leads.filter(l => l.email !== emailToDelete)
  writeLeadsFile(filtered)
  res.json({ ok: true, removed: leads.length - filtered.length })
})

// ─── Goteo API Proxy ───────────────────────────────────────────
app.use('/api/goteo', async (req, res) => {
  const path = req.url
  const url = `${GOTEO_BASE}${path}`
  const auth = Buffer.from(`${GOTEO_USER}:${GOTEO_KEY}`).toString('base64')

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' }
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach Goteo API', details: err.message })
  }
})

// Serve goteo preview static files in production
app.use('/goteo-preview', express.static(join(__dirname, '..', 'public', 'goteo-preview')))

// Serve Vite build in production
app.use(express.static(join(__dirname, '..', 'dist')))
app.get('/{*path}', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
