import React from "react";

interface DropAreaProps {
  isVisible: boolean;
  dragOver: boolean;
  index: number;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: () => void;
}

const DropArea: React.FC<DropAreaProps> = ({
  isVisible,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  return (
    <div
      className={`w-full transition-all ${
        isVisible
          ? "h-2 hover:h-12 my-1 rounded border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50"
          : "h-0"
      } ${dragOver ? "h-12 border-blue-500 bg-blue-50" : "opacity-60"}`}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e);
      }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    ></div>
  );
};

export default DropArea;
