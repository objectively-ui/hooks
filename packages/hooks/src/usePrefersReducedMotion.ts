import { useEffect, useState } from "react";
import { window } from "./utils/globals";
import { isSSR } from "./utils/ssr";

const matcher = isSSR
	? undefined
	: window.matchMedia("(prefers-reduced-motion: reduce)");

export const usePrefersReducedMotion = () => {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(
		matcher?.matches ?? false,
	);

	useEffect(() => {
		const handleChange = (ev: MediaQueryListEvent) => {
			setPrefersReducedMotion(ev.matches);
		};

		matcher?.addEventListener("change", handleChange);

		return matcher?.removeEventListener("change", handleChange);
	}, []);

	return prefersReducedMotion;
};
