import { useEffect, useState } from "react";
import { document } from "./utils/globals";

interface UseSelectionOptions {
	element?: Element;
	allowPartialContainment?: boolean;
}

export const useSelection = (
	opts: UseSelectionOptions = {},
): Selection | null => {
	const { element, allowPartialContainment = true } = opts;

	const [selection, setSelection] = useState<Selection | null>(null);

	useEffect(() => {
    if (element instanceof HTMLInputElement) {
      return
    }

		const handleChange = () => {
			const selection = document.getSelection();

			if (
				!element ||
				(element && selection?.containsNode(element, allowPartialContainment))
			) {
				setSelection(selection);
			} else {
				setSelection(null);
			}
		};

		handleChange();
		document.addEventListener("selectionchange", handleChange, {
			passive: true,
		});

		return () => {
			document.removeEventListener("selectionchange", handleChange);
		};
	}, [element, allowPartialContainment]);

	return selection;
};
