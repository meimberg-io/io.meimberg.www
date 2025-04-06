"use client"

import { useEffect } from "react"

export function MatomoTracker() {
    const enabled = process.env.NEXT_PUBLIC_MATOMO_TRACKER === "true"


    useEffect(() => {
        if (!enabled) return

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
        const _paq = (window._paq = window._paq || [])
        _paq.push(["trackPageView"])
        _paq.push(["disableCookies"])
        _paq.push(["enableLinkTracking"])
        _paq.push(["setTrackerUrl", "https://matomo.meimberg.io/matomo.php"])
        _paq.push(["setSiteId", "2"]) // deine Site-ID

        const d = document, g = d.createElement("script"), s = d.getElementsByTagName("script")[0]
        g.async = true
        g.src = "https://matomo.meimberg.io/matomo.js"
        s.parentNode?.insertBefore(g, s)
    }, [])

    return null
}
