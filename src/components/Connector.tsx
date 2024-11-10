import { useEffect, useState, useRef } from "react";

interface ConnectorProps {
  refA: React.RefObject<HTMLDivElement>;
  refB: React.RefObject<HTMLDivElement>;
  label: string;
  onLabelChange: (newLabel: string) => void;
}

export default function Connector({ refA, refB }: ConnectorProps) {
  const [path, setPath] = useState("");
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const updatePath = () => {
      if (refA.current && refB.current) {
        const rectA = refA.current.getBoundingClientRect();
        const rectB = refB.current.getBoundingClientRect();

        // Center coordinates for each card
        const startX = rectA.left + rectA.width / 2;
        const startY = rectA.top + rectA.height / 2;
        const endX = rectB.left + rectB.width / 2;
        const endY = rectB.top + rectB.height / 2;

        // Control points for a smooth curve
        const controlX1 = startX + (endX - startX) / 2;
        const controlY1 = startY; // Align control point vertically with start
        const controlX2 = endX - (endX - startX) / 2;
        const controlY2 = endY; // Align control point vertically with end

        // Set the path to start and end at the centers of the cards
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
    <svg
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      <path
        d={path}
        className="stroke-lime-500"
        strokeWidth="2"
        fill="none"
        style={{
          transform: "translateY(-6rem)",
        }}
      />
    </svg>
  );
}
