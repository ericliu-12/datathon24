"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  closeModal: () => void;
}

const Modal = ({ closeModal }: ModalProps) => {
  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

interface SidebarProps {
  onCreateNode: () => void;
  onCreateConnection: () => void;
}

export default function Sidebar({ onCreateNode, onCreateConnection }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div>
      {/* Button to open sidebar, positioned at the top right */}
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded focus:outline-none bg-gray-300 text-gray-700 hover:bg-gray-400"
        onClick={toggleSidebar}
      >
        <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
        <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
        <span className="block w-6 h-0.5 bg-gray-700"></span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } duration-300 ease-in-out flex flex-col items-center p-6`}
      >
        {/* Close button inside sidebar */}
        <button
          className="self-end mb-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={toggleSidebar}
        >
          ✕
        </button>
        <h2 className="text-2xl mb-4">Sidebar Menu</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={onCreateNode}
        >
          Create New Node
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={onCreateConnection}
        >
          Create Connection
        </button>
      </div>
    </div>
  );
}
