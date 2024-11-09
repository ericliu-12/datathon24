"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface PostProps {
  title: string;
  sub: string;
  id: number;
  ref: React.RefObject<HTMLDivElement>;
}

type Position = {
  x: number;
  y: number;
};

export default function Post({ title, sub, id, ref }: PostProps) {
  const [position, setPosition] = useState<Position>({
    x: Math.random() * (window.innerWidth * 0.75),
    y: Math.random() * (window.innerHeight * 0.75),
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    e.target.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: any) => {
    if (isDragging) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + e.movementX,
        y: prevPosition.y + e.movementY,
      }));
    }
  };

  const handleMouseUp = (e: any) => {
    setIsDragging(false);
    e.target.style.cursor = "grab";
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <Card
      className={`${
        isDragging ? "z-50" : ""
      } absolute select-none cursor-pointer hover:bg-gray-200 hover:scale-105 transition-transform`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      ref={ref}
      key={id}
      onMouseDown={handleMouseDown}
    >
      <CardHeader className="text-sm p-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{sub}</CardDescription>
      </CardHeader>
    </Card>
  );
}