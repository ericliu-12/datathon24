import { useEffect, useState } from "react";

interface ConnectorProps {
  refA: React.RefObject<HTMLDivElement>;
  refB: React.RefObject<HTMLDivElement>;
  label: string;
  onLabelChange: (newLabel: string) => void;
}

export default function Connector({
  refA,
  refB,
  label,
  onLabelChange,
}: ConnectorProps) {
  const [path, setPath] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const updatePath = () => {
      if (refA.current && refB.current) {
        const rectA = refA.current.getBoundingClientRect();
        const rectB = refB.current.getBoundingClientRect();

        const centerA = {
          x: rectA.x + rectA.width / 2,
          y: rectA.y + rectA.height / 2,
        };
        const centerB = {
          x: rectB.x + rectB.width / 2,
          y: rectB.y + rectB.height / 2,
        };

        const deltaX = centerB.x - centerA.x;
        const deltaY = centerB.y - centerA.y;

        const startX =
          deltaX > 0 ? rectA.right : deltaX < 0 ? rectA.left : centerA.x;
        const startY =
          deltaY > 0 ? rectA.bottom : deltaY < 0 ? rectA.top : centerA.y;
        const endX =
          deltaX > 0 ? rectB.left : deltaX < 0 ? rectB.right : centerB.x;
        const endY =
          deltaY > 0 ? rectB.top : deltaY < 0 ? rectB.bottom : centerB.y;

        const controlX1 = startX + deltaX / 3;
        const controlY1 = startY + deltaY / 3;
        const controlX2 = endX - deltaX / 3;
        const controlY2 = endY - deltaY / 3;

        setPath(
          `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`
        );

        // Position the label halfway along the path
        setPosition({
          x: (startX + endX) / 2,
          y: (startY + endY) / 2,
        });
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

  const handleLabelClick = () => setIsEditing(true);
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onLabelChange(e.target.value);
  const handleBlur = () => setIsEditing(false);

  return (
    <div>
      <svg className="absolute pointer-events-none w-full h-screen -z-10">
        <path d={path} className="stroke-lime-500 fill-none stroke-2" />
      </svg>
      <div
        style={{ position: "absolute", left: position.x, top: position.y }}
        className="bg-white text-gray-700 text-sm p-1 rounded shadow"
      >
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={handleLabelChange}
            onBlur={handleBlur}
            className="border p-1 text-sm"
            autoFocus
          />
        ) : (
          <span onClick={handleLabelClick} className="cursor-pointer">
            {label || "Click to edit"}
          </span>
        )}
      </div>
    </div>
  );
}
