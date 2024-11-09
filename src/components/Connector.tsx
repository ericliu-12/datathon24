import { useEffect, useState } from "react";

interface ConnectorProps {
  refA: React.RefObject<HTMLDivElement>;
  refB: React.RefObject<HTMLDivElement>;
}

export default function Connector({ refA, refB }: ConnectorProps) {
  const [path, setPath] = useState("");

  useEffect(() => {
    const updatePath = () => {
      if (refA.current && refB.current) {
        const rectA = refA.current.getBoundingClientRect();
        const rectB = refB.current.getBoundingClientRect();

        const startX = rectA.x + rectA.width / 2;
        const startY = rectA.y + rectA.height / 2;
        const endX = rectB.x + rectB.width / 2;
        const endY = rectB.y + rectB.height / 2;

        const controlX1 = startX + 150;
        const controlY1 = startY - 150;

        const controlX2 = endX - 150;
        const controlY2 = endY + 150;

        setPath(
          `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`
        );
      }
    };

    updatePath();

    const observer = new MutationObserver(updatePath);
    observer.observe(refA.current!, {
      attributes: true,
      attributeFilter: ["style"],
    });

    observer.observe(refB.current!, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, [refA, refB]);

  return (
    <div>
      <svg className="absolute pointer-events-none w-full h-screen -z-10">
        <path d={path} className=" stroke-lime-500 fill-none stroke-2" />
      </svg>
    </div>
  );
}