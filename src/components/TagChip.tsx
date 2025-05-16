import React from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/16/solid";

interface TagChipProps {
  text: string;
  isSelected?: boolean;
  isAddButton?: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

const TagChip: React.FC<TagChipProps> = ({
  text,
  isSelected = false,
  isAddButton = false,
  onClick,
  onDelete,
}) => {
  if (isAddButton) {
    return (
      <button
        onClick={onClick}
        className="flex items-center bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-full text-sm transition-colors cursor-pointer"
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        <span>{text}</span>
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center px-2 py-1 rounded-full text-sm cursor-pointer border transition-colors ${
        isSelected
          ? "bg-blue-100 text-blue-800 border-blue-300"
          : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
      }`}
    >
      <input type="checkbox" checked={isSelected} className="mr-1 h-3 w-3" />
      <span>{text}</span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-1 text-gray-500 hover:text-red-500 cursor-pointer"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default TagChip;
