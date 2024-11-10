"use client";

import React, { useState, useRef, useEffect } from "react";
import Post from "@/components/Post";
import Connector from "./Connector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AuthButton from "./AuthButton";

export type Node = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  protocols?: string[];
};

export type Connection = {
  source: number;
  destination: number;
  label: string;
  description?: string;
};

interface GraphProps {
  posts: Node[];
  setPosts: React.Dispatch<React.SetStateAction<Node[]>>;
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  deleteNode: any;
}

export default function Graph({
  posts,
  setPosts,
  connections,
  setConnections,
  deleteNode,
  hoveredNode,
}: GraphProps & { hoveredNode: string | null }) {
  const [openDialogs, setOpenDialogs] = useState(
    new Array(posts.length).fill(false)
  );
  const [isEditing, setIsEditing] = useState(
    new Array(posts.length).fill({ title: false, sub: false })
  );
  const nodeRefs = useRef<(HTMLDivElement | null)[]>(
    new Array(posts.length).fill(null)
  );
  const [connectingFrom, setConnectingFrom] = useState<number | null>(null);
  const isDragging = useRef(false);
  const mouseDownTime = useRef(0);

  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    if (posts.length && connections.length) {
      setShouldUpdate(true);
    }
  }, [posts, connections]);

  useEffect(() => {
    if (shouldUpdate) {
      setShouldUpdate(false);
    }
  }, [shouldUpdate]);

  useEffect(() => {
    nodeRefs.current = nodeRefs.current.slice(0, posts.length);
  }, [posts.length]);

  const addNode = () => {
    const newPost = {
      id: posts.length,
      title: "New Node",
      subtitle: "Double click to edit",
    };
    setPosts([...posts, newPost]);
    setOpenDialogs([...openDialogs, false]);
    setIsEditing([...isEditing, { title: false, sub: false }]);
  };

  const handleNodeMouseDown = (e: any) => {
    isDragging.current = false;
    mouseDownTime.current = Date.now();
  };

  const handleNodeMouseMove = (e: any) => {
    if (Date.now() - mouseDownTime.current > 100) {
      isDragging.current = true;
    }
  };

  const handleNodeMouseUp = (index: any) => {
    if (!isDragging.current) {
      handleNodeClick(index);
    } else {
      setConnectingFrom(null);
    }
    isDragging.current = false;
  };

  const handleNodeClick = (index: any) => {
    if (connectingFrom === null) {
      setConnectingFrom(index);
    } else if (connectingFrom !== index) {
      const connectionExists = connections.some(
        (connection) =>
          connection.source === connectingFrom &&
          connection.destination === index
      );
      if (!connectionExists) {
        setConnections([
          ...connections,
          {
            source: connectingFrom,
            destination: index,
            label: "",
          },
        ]);
      }

      setConnectingFrom(null);
    } else {
      setConnectingFrom(null);
    }
  };

  const handleDoubleClick = (index: any, e: any) => {
    e.stopPropagation();
    const newOpenDialogs = [...openDialogs];
    newOpenDialogs[index] = true;
    setOpenDialogs(newOpenDialogs);
  };

  const handleDialogClose = (index: any) => {
    const newOpenDialogs = [...openDialogs];
    newOpenDialogs[index] = false;
    setOpenDialogs(newOpenDialogs);
  };

  const handleTitleClick = (index: any) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = { ...newIsEditing[index], title: true };
    setIsEditing(newIsEditing);
  };

  const handleTitleChange = (index: any, newTitle: any) => {
    const updatedPosts = [...posts];
    updatedPosts[index].title = newTitle;
    setPosts(updatedPosts);
  };

  const handleSubtitleClick = (index: number) => {
    setIsEditing((prev) => {
      const newEditingState = [...prev];
      newEditingState[index] = { sub: true };
      return newEditingState;
    });
  };

  const handleSubtitleChange = (index: number, value: string) => {
    const newDescriptions = [...dialogDescriptions];
    newDescriptions[index] = value; // Update the specific index
    setDialogDescriptions(newDescriptions);
  };

  const handleConfirmChanges = (index: any) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = { title: false, sub: false };
    setIsEditing(newIsEditing);
  };

  const handleLabelChange = (index: any, newLabel: any) => {
    const updatedConnections = [...connections];
    updatedConnections[index].label = newLabel;
    setConnections(updatedConnections);
  };

  const [dialogDescriptions, setDialogDescriptions] = useState<string[]>([]);

  // Initialize dialogDescriptions state
  useEffect(() => {
    const initialDescriptions = posts.map((post) => {
      return `${post.description}\n\nTechnologies: ${(
        post.technologies ?? []
      ).join(", ")}\n\nProtocols: ${(post.protocols ?? []).join(", ")}`;
    });
    setDialogDescriptions(initialDescriptions);
  }, [posts]);

  return (
    <div className="relative flex-grow">
      {/* <Button onClick={() => signIn("google")}></Button> */}
      <Button
        onClick={() => {
          addNode();
        }}
        className="h-13 w-13 rounded-full text-3xl fixed top-[92.5%] right-[68%]"
      >
        +
      </Button>

      <div className="fixed top-4 right-4">
        <AuthButton />
      </div>

      {posts.map((post, index) => (
        <Dialog
          key={index}
          open={openDialogs[index]}
          onOpenChange={() => handleDialogClose(index)}
        >
          <div
            onMouseDown={handleNodeMouseDown}
            onMouseMove={handleNodeMouseMove}
            onMouseUp={() => handleNodeMouseUp(index)}
            onDoubleClick={(e) => handleDoubleClick(index, e)}
          >
            <Post
              id={post.id}
              title={post.title}
              subtitle={post.subtitle}
              ref={(el: HTMLDivElement) => {
                nodeRefs.current[index] = el;
              }}
              handleDelete={deleteNode}
              forceHover={post.id + 1 == hoveredNode}
            />
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing[index]?.title ? (
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    className="focus:outline-none"
                    onBlur={() => handleConfirmChanges(index)}
                  />
                ) : (
                  <span onClick={() => handleTitleClick(index)}>
                    {post.title}
                  </span>
                )}
              </DialogTitle>
              <DialogDescription>
                {isEditing[index]?.sub ? (
                  <textarea
                    value={dialogDescriptions[index] || ""}
                    onChange={(e) =>
                      handleSubtitleChange(index, e.target.value)
                    }
                    className="focus:outline-none w-full h-auto resize-none"
                    onBlur={() => handleConfirmChanges(index)}
                    rows={
                      1 // Start with one row
                    }
                    style={{ height: "auto" }} // Allow height to adjust
                    ref={(el) => {
                      if (el) {
                        el.style.height = "auto"; // Reset height to auto
                        el.style.height = `${el.scrollHeight}px`; // Set height to scroll height
                      }
                    }}
                  />
                ) : (
                  <span
                    className="whitespace-pre-wrap"
                    onClick={() => handleSubtitleClick(index)}
                  >
                    {/* {`${post.description}\n\n${(post.technologies ?? []).join(", ")}`} */}
                    {dialogDescriptions[index]}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}

      {connections.map(({ source, destination, label, description }, index) =>
        nodeRefs.current[source] && nodeRefs.current[destination] ? (
          <Connector
            key={index}
            refA={nodeRefs.current[source]}
            refB={nodeRefs.current[destination]}
            label={label}
            desc={description}
            onLabelChange={(newLabel: string) =>
              handleLabelChange(index, newLabel)
            }
            onDescChange={(newDesc: string) => handleDescChange(index, newDesc)}
          />
        ) : null
      )}
    </div>
  );
}
