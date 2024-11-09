import { useEffect, useState, useRef } from "react";

interface ConnectorProps {
  refA: React.RefObject<HTMLDivElement>;
  refB: React.RefObject<HTMLDivElement>;
}

export default function Connector({ refA, refB }: ConnectorProps) {
  const [path, setPath] = useState("");
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const updatePath = () => {
      if (refA.current && refB.current) {
        const rectA = refA.current.getBoundingClientRect();
        const rectB = refB.current.getBoundingClientRect();

        // Start and end coordinates centered vertically and horizontally on the elements
        const startX = rectA.left + rectA.width / 2;
        const startY = rectA.top + rectA.height / 2;
        const endX = rectB.left + rectB.width / 2;
        const endY = rectB.top + rectB.height / 2;

        // Adjust control points closer to the start and end points
        const controlX1 = startX + (endX - startX) / 3;
        const controlY1 = startY;
        const controlX2 = endX - (endX - startX) / 3;
        const controlY2 = endY;

        setPath(
          `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`
        );
      }
    };

    const debouncedUpdatePath = () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(updatePath);
    };

    updatePath();

    const observer = new MutationObserver(debouncedUpdatePath);
    if (refA.current) {
      observer.observe(refA.current, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }
    if (refB.current) {
      observer.observe(refB.current, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }

    window.addEventListener("resize", debouncedUpdatePath);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      observer.disconnect();
      window.removeEventListener("resize", debouncedUpdatePath);
    };
  }, [refA, refB]);

  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <path d={path} stroke="black" strokeWidth="2" fill="none" />
    </svg>
  );
}
