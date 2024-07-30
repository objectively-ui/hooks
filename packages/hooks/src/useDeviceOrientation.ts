import { useEffect, useState } from "react";
import { window } from "./utils/globals";

interface DeviceOrientation {
	x: number | null;
	y: number | null;
	z: number | null;
	absolute: boolean;
}

export const useDeviceOrientation = (): DeviceOrientation => {
	const [orientation, setOrientation] = useState<DeviceOrientation>({
		absolute: false,
		x: 0,
		y: 0,
		z: 0,
	});

	useEffect(() => {
		const handleChange = (e: DeviceOrientationEvent) => {
			setOrientation({
				x: e.beta,
				y: e.gamma,
				z: e.alpha,
				absolute: e.absolute,
			});
		};

		window.addEventListener("deviceorientation", handleChange, {
			passive: true,
		});

		return () => {
			window.removeEventListener("deviceorientation", handleChange);
		};
	}, []);

	return orientation;
};
