import { useLazyState, useMediaQuery, useWindowSize } from "hamo";
import { useRef } from "react";

export default function App() {
	const { width, height, dpr } = useWindowSize();
	const isMobile = useMediaQuery("(max-width: 800px)");

	const countRef = useRef<HTMLSpanElement>(null);
	const [getCount, setCount] = useLazyState(0, (value, previousValue) => {
		console.log("count", value, previousValue);
		if (countRef.current) {
			countRef.current.textContent = `previous value: ${previousValue?.toString() ?? "undefined"} - current value: ${value?.toString() ?? "undefined"}`;
		}
	});

	return (
		<>
			<div>
				useWindowSize: width: {width} - height: {height} - dpr: {dpr}
			</div>
			<div>useMediaQuery: isMobile: {isMobile ? "true" : "false"}</div>
			<div>
				useLazyState: <span ref={countRef} />
			</div>
			<button type="button" onClick={() => setCount((prev) => prev + 1)}>
				Increment
			</button>
			<button type="button" onClick={() => setCount((prev) => prev - 1)}>
				Decrement
			</button>
		</>
	);
}
