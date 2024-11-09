import React, { useState } from "react";

interface SidebarProps {
  onCreateNode: () => void;
  onCreateConnection: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCreateNode, onCreateConnection }) => {
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
        className={`fixed top-0 right-0 h-full w-64 bg-gray-200 text-gray-800 shadow-lg transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } duration-300 ease-in-out flex flex-col items-center p-6`}
      >
        {/* Close button inside sidebar */}
        <button
          className="self-end text-gray-600 hover:text-gray-800 mb-4 focus:outline-none"
          onClick={toggleSidebar}
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-semibold mb-6">Sidebar Menu</h2>
        
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mb-4 w-full"
          onClick={onCreateNode}
        >
          Create New Node
        </button>
        
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded w-full"
          onClick={onCreateConnection}
        >
          Create Connection
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
