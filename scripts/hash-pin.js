#!/usr/bin/env node
/**
 * Genera un hash bcrypt del PIN admin.
 *
 * Uso:
 *   node scripts/hash-pin.js MiPinSecreto
 *
 * Copia el output y ponlo como ADMIN_PIN_HASH en:
 *   - Tu .env local
 *   - Vercel Environment Variables (Settings > Environment Variables)
 */
import bcrypt from 'bcryptjs'

const pin = process.argv[2]

if (!pin) {
  console.error('Uso: node scripts/hash-pin.js <tu-pin>')
  console.error('Ejemplo: node scripts/hash-pin.js Graciasalegria8')
  process.exit(1)
}

const hash = await bcrypt.hash(pin, 12)
console.log('\n─── Hash generado ───')
console.log(hash)
console.log('\nCopia este valor y ponlo como ADMIN_PIN_HASH en:')
console.log('  1. Tu archivo .env local')
console.log('  2. Vercel > Settings > Environment Variables')
console.log('')
