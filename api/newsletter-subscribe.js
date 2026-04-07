import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'

const DATA_DIR = join(process.cwd(), '.data')
const LEADS_FILE = join(DATA_DIR, 'newsletter-leads.json')

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}

function readLeads() {
  ensureDataDir()
  try {
    return JSON.parse(readFileSync(LEADS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeLeads(leads) {
  ensureDataDir()
  writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8')
}

export default async function handler(req, res) {
  // GET — devolver leads (requiere auth admin)
  if (req.method === 'GET') {
    // Verificar sesión admin
    const JWT_SECRET = process.env.ADMIN_JWT_SECRET
    if (!JWT_SECRET) return res.status(500).json({ error: 'Server config error' })

    const cookies = Object.fromEntries(
      (req.headers.cookie || '').split(';').map(c => {
        const [k, ...v] = c.trim().split('=')
        return [k, v.join('=')]
      })
    )
    const token = cookies['rm-admin-session']
    if (!token) return res.status(401).json({ error: 'No autorizado' })

    // Verificar JWT
    const crypto = await import('crypto')
    try {
      const [header, body, signature] = token.split('.')
      const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url')
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return res.status(401).json({ error: 'No autorizado' })
      }
      const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return res.status(401).json({ error: 'Sesión expirada' })
      }
    } catch {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const leads = readLeads()
    return res.status(200).json({ leads, total: leads.length })
  }

  // POST — suscribir nuevo lead
  if (req.method === 'POST') {
    let email, source
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      email = body?.email?.trim().toLowerCase()
      source = body?.source || 'landing'
    } catch {
      return res.status(400).json({ error: 'Datos inválidos' })
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Email no válido' })
    }

    // Sanitizar email
    if (email.length > 254) {
      return res.status(400).json({ error: 'Email demasiado largo' })
    }

    const leads = readLeads()

    // Verificar duplicado
    if (leads.some(l => l.email === email)) {
      return res.status(200).json({ ok: true, message: 'Ya estás suscrito/a' })
    }

    // Guardar nuevo lead
    leads.push({
      email,
      source,
      subscribedAt: new Date().toISOString(),
      ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown',
      userAgent: (req.headers['user-agent'] || '').substring(0, 200),
    })

    writeLeads(leads)

    return res.status(201).json({ ok: true, message: 'Suscripción confirmada' })
  }

  // DELETE — eliminar lead (requiere auth admin)
  if (req.method === 'DELETE') {
    // Misma verificación de auth que GET
    const JWT_SECRET = process.env.ADMIN_JWT_SECRET
    if (!JWT_SECRET) return res.status(500).json({ error: 'Server config error' })
    const cookies = Object.fromEntries(
      (req.headers.cookie || '').split(';').map(c => {
        const [k, ...v] = c.trim().split('=')
        return [k, v.join('=')]
      })
    )
    const token = cookies['rm-admin-session']
    if (!token) return res.status(401).json({ error: 'No autorizado' })

    const crypto = await import('crypto')
    try {
      const [header, body, signature] = token.split('.')
      const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url')
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return res.status(401).json({ error: 'No autorizado' })
      }
      const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
      if (payload.exp < Math.floor(Date.now() / 1000)) return res.status(401).json({ error: 'Sesión expirada' })
    } catch {
      return res.status(401).json({ error: 'No autorizado' })
    }

    let emailToDelete
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      emailToDelete = body?.email?.trim().toLowerCase()
    } catch {
      return res.status(400).json({ error: 'Datos inválidos' })
    }

    const leads = readLeads()
    const filtered = leads.filter(l => l.email !== emailToDelete)
    writeLeads(filtered)

    return res.status(200).json({ ok: true, removed: leads.length - filtered.length })
  }

  res.setHeader('Allow', 'GET, POST, DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
}
