"use client";

import Post from "@/components/Post";
import { useState, useRef } from "react";
import Connector from "./Connector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const initialPosts = [
  { title: "Digital Risography", sub: "Insights into blend modes" },
  { title: "Figma Basics", sub: "Design with me" },
];

export default function Graph() {
  const refA = useRef<HTMLDivElement>(null);
  const refB = useRef<HTMLDivElement>(null);
  const [openDialogs, setOpenDialogs] = useState<boolean[]>(
    new Array(initialPosts.length).fill(false)
  );
  const [posts, setPosts] = useState(initialPosts);
  const [isEditing, setIsEditing] = useState<
    { title: boolean; sub: boolean }[]
  >(new Array(initialPosts.length).fill({ title: false, sub: false }));

  const handleDoubleClick = (index: number) => {
    const newOpenDialogs = [...openDialogs];
    newOpenDialogs[index] = true;
    setOpenDialogs(newOpenDialogs);
  };

  const handleDialogClose = (index: number) => {
    const newOpenDialogs = [...openDialogs];
    newOpenDialogs[index] = false;
    setOpenDialogs(newOpenDialogs);
  };

  const handleTitleClick = (index: number) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = { ...newIsEditing[index], title: true };
    setIsEditing(newIsEditing);
  };

  const handleSubtitleClick = (index: number) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = { ...newIsEditing[index], sub: true };
    setIsEditing(newIsEditing);
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    const updatedPosts = [...posts];
    updatedPosts[index].title = newTitle;
    setPosts(updatedPosts);
  };

  const handleSubtitleChange = (index: number, newSubtitle: string) => {
    const updatedPosts = [...posts];
    updatedPosts[index].sub = newSubtitle;
    setPosts(updatedPosts);
  };

  const handleConfirmChanges = (index: number) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = { title: false, sub: false };
    setIsEditing(newIsEditing);
  };

  return (
    <div>
      {posts.map((post, index) => (
        <Dialog
          key={index}
          open={openDialogs[index]}
          onOpenChange={() => handleDialogClose(index)}
        >
          <div onDoubleClick={() => handleDoubleClick(index)}>
            <Post {...post} id={index} ref={index === 0 ? refA : refB} />
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
      <Connector refA={refA} refB={refB} />
    </div>
  );
}
