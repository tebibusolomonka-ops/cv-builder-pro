const baseUrl = (process.env.NETSA_CV_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
const routes = ['/', '/templates', '/europass', '/privacy', '/terms', '/dashboard', '/resume/1/edit']

const failures = []

for (const route of routes) {
  try {
    const response = await fetch(`${baseUrl}${route}`, { redirect: 'manual' })
    if (response.status !== 200) failures.push(`${route}: expected 200, received ${response.status}`)

    for (const [header, expected] of [
      ['x-content-type-options', 'nosniff'],
      ['x-frame-options', 'DENY'],
      ['referrer-policy', 'strict-origin-when-cross-origin'],
    ]) {
      if (response.headers.get(header) !== expected) {
        failures.push(`${route}: missing or incorrect ${header}`)
      }
    }
  } catch (error) {
    failures.push(`${route}: ${error instanceof Error ? error.message : 'request failed'}`)
  }
}

if (failures.length > 0) {
  console.error(`Launch check failed against ${baseUrl}:\n- ${failures.join('\n- ')}`)
  process.exitCode = 1
} else {
  console.log(`Launch check passed for ${routes.length} routes at ${baseUrl}`)
}
