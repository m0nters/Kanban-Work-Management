import React, { useState } from "react";

interface DropAreaProps {
  isVisible: boolean; // happens when a card is being dragged
  index: number;
  onDrop: () => void;
}

const DropArea: React.FC<DropAreaProps> = ({ isVisible, onDrop }) => {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`w-full transition-all ${
        isVisible
          ? `my-2 rounded border border-dashed gray-500 ${
              dragOver ? "h-12 border-blue-500 bg-blue-50" : "h-6 opacity-30"
            } `
          : "h-0"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    ></div>
  );
};

export default DropArea;
