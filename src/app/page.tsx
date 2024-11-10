"use client";

import React, { useState, useRef } from "react";
import Graph from "@/components/Graph";
import Post from "@/components/Post";
import Modal from "@/components/ui/Modal";
import TypingPlaceholder from "@/components/ui/TextInput"; // Import TypingPlaceholder component
import { Button } from "@/components/ui/button"; // Import Button component
import { FaPlus } from "react-icons/fa"; // Import Plus icon from react-icons
import Connector from "@/components/Connector"; // Import Connector component

type Node = {
  id: number;
  title: string;
  sub: string;
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState([]);
  const nodeRefs = useRef<{ [key: number]: HTMLDivElement | null }>({}); // Dynamic refs for each node

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createNode = () => {
    const newNode: Node = {
      id: nodes.length + 1,
      title: `Node ${nodes.length + 1}`,
      sub: `Subtitle ${nodes.length + 1}`,
    };
    setNodes([...nodes, newNode]);
  };

  const createConnection = () => {
    if (nodes.length < 2) return;
    const newConnection = {
      from: nodes[nodes.length - 2].id,
      to: nodes[nodes.length - 1].id,
    };
    setConnections([...connections, newConnection]);
  };

  return (
    <div>
      <TypingPlaceholder /> {/* Add TypingPlaceholder component */}
      <div className="pt-24 flex flex-col h-screen">
        {" "}
        {/* Padding to avoid overlap with ChatBar */}
        <Graph />
        {nodes.map((node, index) => (
          <div
            key={node.id}
            ref={(el) => (nodeRefs.current[node.id] = el)} // Assign ref to each node by its id
            style={{
              position: "absolute",
              top: `${100 + index * 200}px`,
              left: "100px",
            }}
          >
            <Post
              title={node.title}
              sub={node.sub}
              id={node.id}
              openModal={openModal}
            />
          </div>
        ))}
        {isModalOpen && <Modal closeModal={closeModal} />}
        {/* Render connectors for each connection */}
        {connections.map((connection, index) => {
          const refA = nodeRefs.current[connection.from];
          const refB = nodeRefs.current[connection.to];
          return refA && refB ? (
            <Connector key={index} refA={refA} refB={refB} />
          ) : null;
        })}
      </div>
    </div>
  );
}
