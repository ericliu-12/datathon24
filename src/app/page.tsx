"use client";

import React, { useState, useEffect } from "react";
import Graph, { Connection, Node } from "@/components/Graph";
import TypingPlaceholder from "@/components/TextInput";
import { useSession } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar";
import VerticalCarousel from "@/components/VerticalCarousel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type DataFlow = {
  scenario?: string;
  steps?: { action: string; node: string }[];
};

type ResponseType = {
  Project: string;
  Nodes: Node[];
  Connections: Connection[];
  Flow?: DataFlow;
};

export default function Home() {
  const { data: session } = useSession();

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showCarousel, setShowCarousel] = useState<boolean>(false);
  const [actions, setActions] = useState([]);

  const handleActionHover = (node: string | null) => {
    setHoveredNode(node);
  };

  const [response, setResponse] = useState<ResponseType>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [graphs, setGraphs] = useState<any[]>([]);

  const handleDeleteNode = (id: number) => {
    setNodes(nodes.filter((node) => node.id !== id));
  };

  const handleToggleCarousel = (isChecked: boolean) => {
    console.log(nodes);
    setShowCarousel(isChecked);
    setHoveredNode(isChecked ? null : "-1"); // Reset hoveredNode to -1 when switch is off
  };

  useEffect(() => {
    if (response && session) {
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

      fetch(`/api/updateUser/${session.user?.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      })
        .then((res) => res.json())
        .then((data) => {
          return fetch(`/api/getGraphs/${session.user?.email}`);
        })
        .then((updatedGraphs) => updatedGraphs.json())
        .then((updatedGraphsData) => {
          setGraphs(updatedGraphsData[0].data);
        })
        .catch((err) => {
          console.error("Error updating data:", err);
        });

      const newSteps = response["Flow"].map((flow: any) => ({
        scenario: flow.scenario,
        steps: flow.steps,
      }));
      setActions(newSteps[0].steps);
    }
  }, [response]);

  useEffect(() => {
    if (session) {
      const fetchGraphs = async () => {
        try {
          const res = await fetch(`/api/getGraphs/${session.user?.email}`);
          const response = await res.json();

          if (response && response[0]) setGraphs(response[0].data);
        } catch (error) {
          console.error("Error fetching graphs:", error);
        }
      };

      fetchGraphs();
    }
  }, [session]);

  return (
    <>
      <AppSidebar
        items={graphs}
        setNodes={setNodes}
        setConnections={setConnections}
      />
      <div>
        <TypingPlaceholder response={response} setResponse={setResponse} />
        <div className="flex flex-col h-screen">
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
          <Switch
            checked={showCarousel}
            onCheckedChange={handleToggleCarousel}
          />
        </div>
      </div>
    </>
  );
}
