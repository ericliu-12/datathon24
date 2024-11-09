"use client";

import { useState, useRef } from "react";
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

const initialPosts = [
  { title: "Digital Risography", sub: "Insights into blend modes" },
  { title: "Figma Basics", sub: "Design with me" },
];

const createRefs = (count) =>
  Array(count)
    .fill(null)
    .map(() => ({ current: null }));

export default function Graph() {
  const [posts, setPosts] = useState(initialPosts);
  const [openDialogs, setOpenDialogs] = useState(
    new Array(initialPosts.length).fill(false)
  );
  const [isEditing, setIsEditing] = useState(
    new Array(initialPosts.length).fill({ title: false, sub: false })
  );
  const [nodeRefs, setNodeRefs] = useState(createRefs(initialPosts.length));
  const [connections, setConnections] = useState<
    Array<{ from: number; to: number; label: string }>
  >([]);
  const [connectingFrom, setConnectingFrom] = useState<number | null>(null);
  const isDragging = useRef(false);
  const mouseDownTime = useRef(0);

  const addNode = () => {
    const newPost = { title: "New Node", sub: "Click to edit" };
    setPosts([...posts, newPost]);
    setOpenDialogs([...openDialogs, false]);
    setIsEditing([...isEditing, { title: false, sub: false }]);
    setNodeRefs([...nodeRefs, { current: null }]);
  };

  const handleNodeMouseDown = (e) => {
    isDragging.current = false;
    mouseDownTime.current = Date.now();
  };

  const handleNodeMouseMove = (e) => {
    if (Date.now() - mouseDownTime.current > 100) {
      isDragging.current = true;
    }
  };

  const handleNodeMouseUp = (index) => {
    if (!isDragging.current) {
      handleNodeClick(index);
    }
    isDragging.current = false;
  };

  const handleNodeClick = (index) => {
    if (connectingFrom === null) {
      setConnectingFrom(index);
    } else if (connectingFrom !== index) {
      setConnections([
        ...connections,
        { from: connectingFrom, to: index, label: "Click to edit" },
      ]);
      setConnectingFrom(null);
    } else {
      setConnectingFrom(null);
    }
  };

  const handleDoubleClick = (index, e) => {
    e.stopPropagation();
    const newOpenDialogs = [...openDialogs];
    newOpenDialogs[index] = true;
    setOpenDialogs(newOpenDialogs);
  };

  const handleDialogClose = (index) => {
    const newOpenDialogs = [...openDialogs];
    newOpenDialogs[index] = false;
    setOpenDialogs(newOpenDialogs);
  };

  const handleTitleClick = (index) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = { ...newIsEditing[index], title: true };
    setIsEditing(newIsEditing);
  };

  const handleSubtitleClick = (index) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = { ...newIsEditing[index], sub: true };
    setIsEditing(newIsEditing);
  };

  const handleTitleChange = (index, newTitle) => {
    const updatedPosts = [...posts];
    updatedPosts[index].title = newTitle;
    setPosts(updatedPosts);
  };

  const handleSubtitleChange = (index, newSubtitle) => {
    const updatedPosts = [...posts];
    updatedPosts[index].sub = newSubtitle;
    setPosts(updatedPosts);
  };

  const handleConfirmChanges = (index) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = { title: false, sub: false };
    setIsEditing(newIsEditing);
  };

  const handleLabelChange = (index, newLabel) => {
    const updatedConnections = [...connections];
    updatedConnections[index].label = newLabel;
    setConnections(updatedConnections);
  };

  return (
    <div className="relative min-h-screen">
      <Button onClick={addNode} className="fixed top-4 right-4">
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
            className={connectingFrom === index ? "ring-2 ring-lime-500" : ""}
          >
            <Post
              {...post}
              id={index}
              ref={(el) => {
                nodeRefs[index].current = el;
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
                    value={post.sub}
                    onChange={(e) =>
                      handleSubtitleChange(index, e.target.value)
                    }
                    className="focus:outline-none"
                    onBlur={() => handleConfirmChanges(index)}
                  />
                ) : (
                  <span onClick={() => handleSubtitleClick(index)}>
                    {post.sub}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}

      {connections.map(({ from, to, label }, index) =>
        nodeRefs[from]?.current && nodeRefs[to]?.current ? (
          <Connector
            key={index}
            refA={nodeRefs[from]}
            refB={nodeRefs[to]}
            label={label}
            onLabelChange={(newLabel) => handleLabelChange(index, newLabel)}
          />
        ) : null
      )}
    </div>
  );
}
