import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/16/solid";

interface TagChipProps {
  text: string;
  isSelected?: boolean;
  isAddButton?: boolean;
  onClick: () => void;
  onDelete?: () => void;
  onEdit?: (oldText: string, newText: string) => void; // New prop for editing
}

const TagChip: React.FC<TagChipProps> = ({
  text,
  isSelected = false,
  isAddButton = false,
  onClick,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select all text
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim() === "") {
      setEditText(text); // Revert to original
      setIsEditing(false);
      return;
    }

    if (editText !== text && onEdit) {
      onEdit(text, editText.trim());
    }

    setIsEditing(false);
  };

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
      onClick={!isEditing ? onClick : undefined}
      className={`flex items-center px-2 py-1 rounded-full text-sm border transition-colors ${
        isSelected
          ? "bg-blue-100 text-blue-800 border-blue-300"
          : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
      } ${isEditing ? "cursor-text" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        className="mr-1 h-3 w-3"
        onClick={(e) => e.stopPropagation()}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditText(text); // Revert to original
              setIsEditing(false);
            }
            e.stopPropagation();
          }}
          className="bg-transparent w-full outline-none text-blue-800 text-sm"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          onDoubleClick={(e) => {
            e.stopPropagation();
            if (onEdit) setIsEditing(true);
          }}
        >
          {text}
        </span>
      )}

      {onDelete && !isEditing && (
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
