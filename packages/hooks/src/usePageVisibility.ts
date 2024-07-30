import { useEffect, useRef, useState } from "react";
import { useSSR } from "./useSSR";
import { document } from "./utils/globals";

interface UsePageVisibilityOptions {
	onVisibilityChange?: (visible: boolean) => void;
}

interface UsePageVisibilityReturn {
	visible: boolean;
}

const getIsVisible = () => !document.hidden;

export const usePageVisibility = (
	opts?: UsePageVisibilityOptions,
): UsePageVisibilityReturn => {
	const ssr = useSSR();
	const initialValue = ssr ? false : getIsVisible();
	const visibilityStateRef = useRef(initialValue);
	const [isVisible, setIsVisible] = useState(initialValue);
	const onVisibilityChange = opts?.onVisibilityChange;

	useEffect(() => {
		const handleVisibilityChange = () => {
			const v = getIsVisible();

			if (visibilityStateRef.current !== v) {
				visibilityStateRef.current = v;
				setIsVisible(v);
				onVisibilityChange?.(v);
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange, {
			passive: true,
		});
		handleVisibilityChange();

		return () =>
			document.removeEventListener("visibilitychange", handleVisibilityChange);
	}, [onVisibilityChange]);

	return {
		visible: isVisible,
	};
};
