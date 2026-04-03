import express from 'express'
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
    const [key, ...vals] = line.split('=')
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim()
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
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// Proxy to Goteo API
app.use('/api/goteo', async (req, res) => {
  const path = req.url
  const url = `${GOTEO_BASE}${path}`
  const auth = Buffer.from(`${GOTEO_USER}:${GOTEO_KEY}`).toString('base64')

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
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
