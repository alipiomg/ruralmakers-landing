export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const isSecure = req.headers['x-forwarded-proto'] === 'https'
  const cookieValue = [
    'rm-admin-session=',
    'HttpOnly',
    isSecure ? 'Secure' : '',
    'SameSite=Lax',
    'Path=/',
    'Max-Age=0',
  ].filter(Boolean).join('; ')

  res.setHeader('Set-Cookie', cookieValue)
  return res.status(200).json({ ok: true })
}
