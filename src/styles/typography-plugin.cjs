const typography = require('@tailwindcss/typography')

// Legacy selector target: prose rules are not wrapped in :where(), so they beat
// Tailwind Preflight's `a { color: inherit }`. Theme/customization stays in
// typography.ts via @config.
module.exports = typography({ target: 'legacy' })
