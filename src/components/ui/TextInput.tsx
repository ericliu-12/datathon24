import React, { useState, useEffect } from "react";

const placeholderTexts = [
  "Show me how to design Netflix",
  "Help me design my startup's systems",
  "Create your project workflow",
  "How can I help you today?",
];

const TypingPlaceholder = () => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const typingSpeed = 50;
  const deletingSpeed = 25;
  const delayBetweenLoops = 1000;

  useEffect(() => {
    const currentText = placeholderTexts[loopIndex % placeholderTexts.length];

    let timeout: NodeJS.Timeout;
    if (!isDeleting) {
      // Typing effect
      if (text.length < currentText.length) {
        timeout = setTimeout(
          () => setText(currentText.slice(0, text.length + 1)),
          typingSpeed
        );
      } else {
        // Start deleting after a delay when typing is complete
        timeout = setTimeout(() => setIsDeleting(true), delayBetweenLoops);
      }
    } else {
      // Deleting effect
      if (text.length > 0) {
        timeout = setTimeout(
          () => setText(currentText.slice(0, text.length - 1)),
          deletingSpeed
        );
      } else {
        // Move to the next text after deleting is complete
        setIsDeleting(false);
        setLoopIndex((prev) => prev + 1);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, loopIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: inputValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setInputValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border rounded p-2 fixed top-4 left-4 right-4 bg-white shadow-lg"
    >
      <input
        type="text"
        placeholder={text}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-grow p-2 border-none outline-none"
      />
      <button type="submit" className="ml-2 p-2 bg-blue-300 text-white rounded">
        Search
      </button>
    </form>
  );
};

export default TypingPlaceholder;
