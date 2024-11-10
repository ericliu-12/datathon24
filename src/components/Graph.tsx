"use client";

import { useState, useRef, useEffect } from "react";
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
import { Plus } from "lucide-react";
// import { signIn } from "next-auth/react";
import AuthButton from "./AuthButton";

export type Node = {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
  technologies?: string[];
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
}

export default function Graph({
  posts,
  setPosts,
  connections,
  setConnections,
}: GraphProps) {
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

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  useEffect(() => {
    console.log(nodeRefs);
  }, [nodeRefs]);

  useEffect(() => {
    console.log(connections);
  }, [connections]);

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
            label: "Click to edit",
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

  const handleSubtitleClick = (index: any) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = { ...newIsEditing[index], sub: true };
    setIsEditing(newIsEditing);
  };

  const handleTitleChange = (index: any, newTitle: any) => {
    const updatedPosts = [...posts];
    updatedPosts[index].title = newTitle;
    setPosts(updatedPosts);
  };

  const handleSubtitleChange = (index: any, newSubtitle: any) => {
    const updatedPosts = [...posts];
    updatedPosts[index].subtitle = newSubtitle;
    setPosts(updatedPosts);
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

  return (
    <div className="relative flex-grow">
      {/* <Button onClick={() => signIn("google")}></Button> */}
      <Button onClick={addNode} className="fixed top-24 right-4">
        <Plus className="mr-2" /> Add Node
      </Button>

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
                  <input
                    type="text"
                    value={post.subtitle}
                    onChange={(e) =>
                      handleSubtitleChange(index, e.target.value)
                    }
                    className="focus:outline-none"
                    onBlur={() => handleConfirmChanges(index)}
                  />
                ) : (
                  <span onClick={() => handleSubtitleClick(index)}>
                    {post.subtitle}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}

      {connections.map(({ source, destination, label }, index) =>
        nodeRefs.current[source] && nodeRefs.current[destination] ? (
          <Connector
            key={index}
            refA={nodeRefs.current[source]}
            refB={nodeRefs.current[destination]}
            label={label}
            onLabelChange={(newLabel) => handleLabelChange(index, newLabel)}
          />
        ) : null
      )}
    </div>
  );
}
