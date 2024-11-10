"use client";

import React, { useState, useEffect } from "react";
import Graph, { Connection, Node } from "@/components/Graph";
import TypingPlaceholder from "@/components/TextInput";
import VerticalCarousel from "@/components/VerticalCarousel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showCarousel, setShowCarousel] = useState<boolean>(false);
  const [actions, setActions] = useState([]);

  const handleActionHover = (node: string | null) => {
    setHoveredNode(node);
  };

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

  const handleToggleCarousel = (isChecked: boolean) => {
    console.log(nodes);
    setShowCarousel(isChecked);
    setHoveredNode(isChecked ? null : "-1"); // Reset hoveredNode to -1 when switch is off
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

      const newSteps = response["Flow"].map((flow) => ({
        scenario: flow.scenario,
        steps: flow.steps,
      }));
      setActions(newSteps[0].steps);
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
          hoveredNode={hoveredNode}
        />
      </div>
      {showCarousel && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/10 max-w-xs">
          <VerticalCarousel
            onActionHover={handleActionHover}
            actions={actions}
          />
        </div>
      )}
      <div className="absolute bottom-8 right-8 flex items-center gap-2">
        <Label htmlFor="airplane-mode">enable workflow</Label>
        <Switch checked={showCarousel} onCheckedChange={handleToggleCarousel} />
      </div>
    </div>
  );
}