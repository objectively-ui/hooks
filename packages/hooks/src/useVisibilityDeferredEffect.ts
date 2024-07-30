import {
	type DependencyList,
	type EffectCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { usePageVisibility } from "./usePageVisibility";

export const useVisibilityDeferredEffect = (
	effect: EffectCallback,
	deps: DependencyList = [],
): void => {
	const { visible } = usePageVisibility();
	const [wasVisible, setWasVisible] = useState(visible);

	useEffect(() => {
		if (visible) {
			setWasVisible(true);
		}
	}, [visible]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!wasVisible) {
			return;
		}

		return effect();
	}, [wasVisible, ...deps]);
};
