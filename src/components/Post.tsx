"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { X } from "lucide-react";

interface PostProps {
  title: string;
  subtitle: string;
  id: number;
  ref: any;
  handleDelete: any;
}

type Position = {
  x: number;
  y: number;
};

export default function Post({
  title,
  subtitle,
  id,
  ref,
  handleDelete,
}: PostProps) {
  const [position, setPosition] = useState<Position>({
    x: Math.random() * (window.innerWidth - 450) + 50,
    y: Math.random() * (window.innerHeight - 250),
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      } absolute select-none cursor-pointer hover:bg-gray-100 hover:scale-105 transition-transform w-52`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      ref={ref}
      key={id}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="text-sm p-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
        {isHovered && (
          <button
            className="absolute right-2 top-0 text-red-500 hover:text-red-700"
            onClick={() => handleDelete(id)}
          >
            <X size={18} />
          </button>
        )}
      </CardHeader>
    </Card>
  );
}
