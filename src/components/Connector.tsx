import { useEffect, useState, useRef } from "react";

interface ConnectorProps {
  refA: HTMLDivElement;
  refB: HTMLDivElement;
  label: string;
  onLabelChange: any;
}

export default function Connector({
  refA,
  refB,
  label,
  onLabelChange,
}: ConnectorProps) {
  const [path, setPath] = useState("");
  const [labelPos, setLabelPos] = useState([0]);
  const [labelText, setLabelText] = useState(label);

  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const updatePath = () => {
      if (refA && refB) {
        const rectA = refA.getBoundingClientRect();
        const rectB = refB.getBoundingClientRect();

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

        setLabelPos([
          (controlX1 + controlX2) / 2 - 30,
          (controlY1 + controlY2) / 2 - 10,
        ]);

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
    if (refA) {
      observer.observe(refA, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }
    if (refB) {
      observer.observe(refB, {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(e.target.value);
  };

  const handleInputBlur = () => {
    onLabelChange(labelText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onLabelChange(labelText);
      e.currentTarget.blur();
    }
  };

  return (
    <>
      <div className="fixed" style={{ left: labelPos[0], top: labelPos[1] }}>
        <input
          type="text"
          placeholder="Click to edit"
          value={labelText}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="border-none outline-none p-1 bg-transparent text-sm text-gray-700 text-wrap"
        />
      </div>

      <svg className="w-screen h-screen top-0 left-0 fixed pointer-events-none -z-10">
        <path d={path} className="stroke-lime-500 fill-none stroke-2" />
      </svg>
    </>
  );
}
