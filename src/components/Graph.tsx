"use client";

import Post from "@/components/Post";
import { useRef } from "react";
import Connector from "./Connector";

const Posts = [
  { title: "Digital Risography", sub: "Insights into blend modes" },
  { title: "Figma Basics", sub: "Design with me" },
];

export default function Graph() {
  const refA = useRef<HTMLDivElement>(null);
  const refB = useRef<HTMLDivElement>(null);

  return (
    <div>
      {Posts.map((post, index) => (
        <Post {...post} id={index} ref={index === 0 ? refA : refB} />
      ))}
      <Connector refA={refA} refB={refB} />
    </div>
  );
}
