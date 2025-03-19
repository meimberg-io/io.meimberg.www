# typescript

## middleware.js

```typescript

import { NextResponse } from "next/server";
export function middleware(req) {
	if (req.nextUrl.searchParams.has("_storyblok")) {
		const res = NextResponse.next();
		res.cookies.set("isPreview", "true", { path: "/" });
		return res;
	}
	return NextResponse.next();
}
export const config = {
	matcher: "/:path*", // Middleware für alle Routen aktivieren
};
```
