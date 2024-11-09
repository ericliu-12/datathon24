"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import React, { useState } from "react";

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
      setPosition({
        x: position.x + e.movementX,
        y: position.y + e.movementY,
      });
    }
  };

  const handleMouseUp = (e: any) => {
    setIsDragging(false);
    e.target.style.cursor = "grab";
  };

  return (
    <Card
      className={`${
        isDragging ? "z-50" : ""
      } absolute select-none hover:cursor-pointer`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      ref={ref}
      key={id}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <CardHeader className="text-sm p-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{sub}</CardDescription>
      </CardHeader>
    </Card>
  );
}
