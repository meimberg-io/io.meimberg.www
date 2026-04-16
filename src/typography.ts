import { type Config } from 'tailwindcss'

export default {
  theme: {
    typography: ({ theme }) => ({
      invert: {
        css: {
          '--tw-prose-body': 'var(--tw-prose-invert-body)',
          '--tw-prose-headings': 'var(--tw-prose-invert-headings)',
          '--tw-prose-links': 'var(--tw-prose-invert-links)',
          '--tw-prose-links-hover': 'var(--tw-prose-invert-links-hover)',
          '--tw-prose-underline': 'var(--tw-prose-invert-underline)',
          '--tw-prose-underline-hover':
            'var(--tw-prose-invert-underline-hover)',
          '--tw-prose-bold': 'var(--tw-prose-invert-bold)',
          '--tw-prose-counters': 'var(--tw-prose-invert-counters)',
          '--tw-prose-bullets': 'var(--tw-prose-invert-bullets)',
          '--tw-prose-hr': 'var(--tw-prose-invert-hr)',
          '--tw-prose-quote-borders': 'var(--tw-prose-invert-quote-borders)',
          '--tw-prose-captions': 'var(--tw-prose-invert-captions)',
          '--tw-prose-code': 'var(--tw-prose-invert-code)',
          '--tw-prose-code-bg': 'var(--tw-prose-invert-code-bg)',
          '--tw-prose-pre-code': 'var(--tw-prose-invert-pre-code)',
          '--tw-prose-pre-bg': 'var(--tw-prose-invert-pre-bg)',
          '--tw-prose-pre-border': 'var(--tw-prose-invert-pre-border)',
          '--tw-prose-th-borders': 'var(--tw-prose-invert-th-borders)',
          '--tw-prose-td-borders': 'var(--tw-prose-invert-td-borders)',
        },
      },
      DEFAULT: {
        css: {
          // Prose-only typography contract: markdown/richtext rhythm and style.
          // Colors are wired to the semantic tokens in src/styles/tailwind.css.
          // Because those tokens auto-swap via the .dark cascade, the invert-*
          // vars below point to the SAME var()s — `prose-invert` becomes a
          // no-op for color, and dark-mode values come from the .dark block.
          '--tw-prose-body': 'var(--color-body)',
          '--tw-prose-headings': 'var(--color-accent)',
          '--tw-prose-links': 'var(--color-interactive)',
          '--tw-prose-links-hover': 'var(--color-interactive-hover)',
          '--tw-prose-underline': 'color-mix(in oklab, var(--color-interactive) 20%, transparent)',
          '--tw-prose-underline-hover': 'var(--color-interactive)',
          '--tw-prose-bold': 'var(--color-foreground-soft)',
          '--tw-prose-counters': 'var(--color-foreground-strong)',
          '--tw-prose-bullets': 'var(--color-foreground-strong)',
          '--tw-prose-hr': 'var(--color-border-subtle)',
          '--tw-prose-quote-borders': 'var(--color-border)',
          '--tw-prose-captions': 'var(--color-subtle-foreground)',
          '--tw-prose-code': 'var(--color-foreground-strong)',
          '--tw-prose-code-bg': 'color-mix(in oklab, var(--color-foreground) 10%, transparent)',
          '--tw-prose-pre-code': theme('colors.zinc.100'),
          '--tw-prose-pre-bg': theme('colors.zinc.900'),
          '--tw-prose-pre-border': 'transparent',
          '--tw-prose-th-borders': 'var(--color-border)',
          '--tw-prose-td-borders': 'var(--color-border-subtle)',

          '--tw-prose-invert-body': 'var(--color-body)',
          '--tw-prose-invert-headings': 'var(--color-accent)',
          '--tw-prose-invert-links': 'var(--color-interactive)',
          '--tw-prose-invert-links-hover': 'var(--color-interactive-hover)',
          '--tw-prose-invert-underline': 'color-mix(in oklab, var(--color-interactive) 30%, transparent)',
          '--tw-prose-invert-underline-hover': 'var(--color-interactive)',
          '--tw-prose-invert-bold': 'var(--color-foreground-soft)',
          '--tw-prose-invert-counters': 'var(--color-foreground-strong)',
          '--tw-prose-invert-bullets': 'var(--color-foreground-strong)',
          '--tw-prose-invert-hr': 'var(--color-border-subtle)',
          '--tw-prose-invert-quote-borders': 'var(--color-border)',
          '--tw-prose-invert-captions': 'var(--color-subtle-foreground)',
          '--tw-prose-invert-code': 'var(--color-foreground-strong)',
          '--tw-prose-invert-code-bg': 'color-mix(in oklab, var(--color-foreground) 10%, transparent)',
          '--tw-prose-invert-pre-code': theme('colors.zinc.100'),
          '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 0.4)',
          '--tw-prose-invert-pre-border': 'color-mix(in oklab, var(--color-zinc-200) 10%, transparent)',
          '--tw-prose-invert-th-borders': 'var(--color-border)',
          '--tw-prose-invert-td-borders': 'var(--color-border-subtle)',

          // Base
          color: 'var(--tw-prose-body)',
          lineHeight: theme('lineHeight.7'),
          '> *': {
            marginTop: '1.5rem',
            marginBottom: '1.5rem',
          },
          p: {
            marginTop: '0.75rem',
            marginBottom: '0.75rem',
          },

          // Headings
          // Only h2 is colored via --tw-prose-headings (= accent). h3+ inherit
          // body color, keeping brand-color use restrained to the top-level
          // content heading.
          'h2, h3': {
            fontWeight: theme('fontWeight.semibold'),
          },
          h2: {
            color: 'var(--tw-prose-headings)',
            fontSize: theme('fontSize.xl')[0],
            lineHeight: theme('lineHeight.7'),
            marginTop: '2.5rem',
            marginBottom: '0.75rem',
          },
          h3: {
            color: 'var(--color-foreground-soft)',
            fontSize: theme('fontSize.base')[0],
            lineHeight: theme('lineHeight.7'),
            marginTop: '1.75rem',
            marginBottom: '0.75rem',
          },
          ':is(h2, h3) + *': {
            marginTop: 0,
          },

          // Images
          img: {
            borderRadius: theme('borderRadius.3xl'),
          },

          // Inline elements
          a: {
            color: 'var(--tw-prose-links)',
            fontWeight: theme('fontWeight.semibold'),
            textDecoration: 'underline',
            textDecorationColor: 'var(--tw-prose-underline)',
            transitionProperty: 'color, text-decoration-color',
            transitionDuration: theme('transitionDuration.150'),
            transitionTimingFunction: theme('transitionTimingFunction.in-out'),
          },
          'a:hover': {
            color: 'var(--tw-prose-links-hover)',
            textDecorationColor: 'var(--tw-prose-underline-hover)',
          },
          strong: {
            color: 'var(--tw-prose-bold)',
            fontWeight: theme('fontWeight.semibold'),
          },
          code: {
            display: 'inline-block',
            color: 'var(--tw-prose-code)',
            fontSize: theme('fontSize.sm')[0],
            fontWeight: theme('fontWeight.semibold'),
            backgroundColor: 'var(--tw-prose-code-bg)',
            borderRadius: theme('borderRadius.lg'),
            paddingLeft: theme('spacing.1'),
            paddingRight: theme('spacing.1'),
          },
          'a code': {
            color: 'inherit',
          },
          ':is(h2, h3) code': {
            fontWeight: theme('fontWeight.bold'),
          },

          // Quotes
          blockquote: {
            paddingLeft: theme('spacing.6'),
            borderLeftWidth: theme('borderWidth.2'),
            borderLeftColor: 'var(--tw-prose-quote-borders)',
            fontStyle: 'italic',
          },

          // Figures
          figcaption: {
            color: 'var(--tw-prose-captions)',
            fontSize: theme('fontSize.sm')[0],
            lineHeight: theme('lineHeight.6'),
            marginTop: theme('spacing.3'),
          },
          'figcaption > p': {
            margin: 0,
          },

          // Lists
          ul: {
            listStyleType: 'disc',
          },
          ol: {
            listStyleType: 'decimal',
          },
          'ul, ol': {
            paddingLeft: theme('spacing.6'),
          },
          li: {
            marginTop: '0.25rem',
            marginBottom: '0.25rem',
            paddingLeft: theme('spacing[3.5]'),
          },
          'li::marker': {
            fontSize: theme('fontSize.sm')[0],
            fontWeight: theme('fontWeight.semibold'),
          },
          'ol > li::marker': {
            color: 'var(--tw-prose-counters)',
          },
          'ul > li::marker': {
            color: 'var(--tw-prose-bullets)',
          },
          'li :is(ol, ul)': {
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
          },
          'li :is(li, p)': {
            marginTop: '0.375rem',
            marginBottom: '0.375rem',
          },

          // Code blocks
          pre: {
            color: 'var(--tw-prose-pre-code)',
            fontSize: theme('fontSize.sm')[0],
            fontWeight: theme('fontWeight.medium'),
            backgroundColor: 'var(--tw-prose-pre-bg)',
            borderRadius: theme('borderRadius.3xl'),
            padding: theme('spacing.8'),
            overflowX: 'auto',
            border: '1px solid',
            borderColor: 'var(--tw-prose-pre-border)',
          },
          'pre code': {
            display: 'inline',
            color: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 0,
          },

          // Horizontal rules
          hr: {
            marginTop: theme('spacing.20'),
            marginBottom: theme('spacing.20'),
            borderTopWidth: '1px',
            borderColor: 'var(--tw-prose-hr)',
            '@screen lg': {
              marginLeft: `calc(${theme('spacing.12')} * -1)`,
              marginRight: `calc(${theme('spacing.12')} * -1)`,
            },
          },

          // Tables
          table: {
            width: '100%',
            tableLayout: 'auto',
            textAlign: 'left',
            fontSize: theme('fontSize.sm')[0],
          },
          thead: {
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--tw-prose-th-borders)',
          },
          'thead th': {
            color: 'var(--tw-prose-headings)',
            fontWeight: theme('fontWeight.semibold'),
            verticalAlign: 'bottom',
            paddingBottom: theme('spacing.2'),
          },
          'thead th:not(:first-child)': {
            paddingLeft: theme('spacing.2'),
          },
          'thead th:not(:last-child)': {
            paddingRight: theme('spacing.2'),
          },
          'tbody tr': {
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--tw-prose-td-borders)',
          },
          'tbody tr:last-child': {
            borderBottomWidth: 0,
          },
          'tbody td': {
            verticalAlign: 'baseline',
          },
          tfoot: {
            borderTopWidth: '1px',
            borderTopColor: 'var(--tw-prose-th-borders)',
          },
          'tfoot td': {
            verticalAlign: 'top',
          },
          ':is(tbody, tfoot) td': {
            paddingTop: theme('spacing.2'),
            paddingBottom: theme('spacing.2'),
          },
          ':is(tbody, tfoot) td:not(:first-child)': {
            paddingLeft: theme('spacing.2'),
          },
          ':is(tbody, tfoot) td:not(:last-child)': {
            paddingRight: theme('spacing.2'),
          },
        },
      },
    }),
  },
} satisfies Config
