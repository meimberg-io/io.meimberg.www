"use client";

import { useState, useEffect } from "react";

type IconProps = {
	svgText: string;
	className: string;
};

export function Icon({ svgText, className }: Readonly<IconProps>) {
	const [parsedSvg, setParsedSvg] = useState<string | null>(null);

	useEffect(() => {
		if (!svgText) return;

		const parser = new DOMParser();
		const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
		const svgElement = svgDoc.querySelector("svg");

		if (svgElement) {
			const existingClass = svgElement.getAttribute("class") ?? "";
			svgElement.setAttribute("class", `${existingClass} ${className}`.trim());

			setParsedSvg(svgElement.outerHTML);
		}
	}, [svgText, className]);

	if (!parsedSvg) return null;

	return <span dangerouslySetInnerHTML={{ __html: parsedSvg }} suppressHydrationWarning />;
}
