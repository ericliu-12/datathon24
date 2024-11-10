"use client";

import React, { useState, useEffect } from "react";
import Graph, { Connection, Node } from "@/components/Graph";
import TypingPlaceholder from "@/components/TextInput";
import VerticalCarousel from "@/components/VerticalCarousel";

type DataFlow = {
  scenario?: string;
  steps?: { action: string; node: string }[];
};

type ResponseType = {
  Nodes: Node[];
  Connections: Connection[];
  Flow: DataFlow;
};

export default function Home() {
  const [response, setResponse] = useState<ResponseType>();
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 0,
      title: "Digital Risography",
      subtitle: "Insights into blend modes",
    },
    { id: 1, title: "Figma Basics", subtitle: "Design with me" },
  ]);
  const [connections, setConnections] = useState<Connection[]>([]);

  const handleDeleteNode = (id: number) => {
    setNodes(nodes.filter((node) => node.id !== id));
  };

  useEffect(() => {
    if (response) {
      const newNodes = response["Nodes"].map((node) => ({
        id: node.id - 1,
        title: node.title,
        subtitle: node.subtitle,
        description: node.description,
        technologies: node.technologies,
        protocols: node.protocols,
      }));

      const newConnections = response["Connections"].map((connection) => ({
        source: connection.source - 1,
        destination: connection.destination - 1,
        label: connection.label,
        description: connection.description,
      }));

      setNodes(newNodes);
      setConnections(newConnections);
    }
  }, [response]);

  return (
    <div>
      <TypingPlaceholder response={response} setResponse={setResponse} />
      <div className="pt-24 flex flex-col h-screen">
        <Graph
          posts={nodes}
          setPosts={setNodes}
          connections={connections}
          setConnections={setConnections}
          deleteNode={handleDeleteNode}
        />
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/10 max-w-xs">
        <VerticalCarousel />
      </div>
    </div>
  );
}
