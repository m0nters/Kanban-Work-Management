import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/16/solid";

interface TagChipProps {
  text: string;
  isSelected?: boolean;
  isAddButton?: boolean;
  onClick?: () => void; // if there's no onClick, the chip is just for displaying
  onDelete?: () => void;
  onEdit?: (oldText: string, newText: string) => void;
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
    }
  }, [isEditing]);

  const handleSave = () => {
    const updatedEditText = editText.trim();
    if (updatedEditText === "") {
      setEditText(text); // Revert to original
      setIsEditing(false);
      return;
    }

    if (updatedEditText !== text && onEdit) {
      onEdit(text, updatedEditText);
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
        <span className="mr-2">{text}</span>
      </button>
    );
  }

  return (
    <div
      onClick={onClick && !isEditing ? onClick : undefined}
      className={`flex items-center px-2 py-1 rounded-full text-sm border transition-colors ${
        isSelected
          ? "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
          : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
      } ${
        isEditing
          ? "cursor-text"
          : onClick
          ? "cursor-pointer"
          : "cursor-default"
      }`}
    >
      {onClick && (
        <input
          type="checkbox"
          checked={isSelected}
          className="mr-1 h-3 w-3 cursor-pointer"
        />
      )}

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
          className="bg-transparent w-full outline-none text-sm"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          onDoubleClick={(e) => {
            e.stopPropagation();
            if (onEdit) setIsEditing(true);
          }}
          className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px]" // in case the text is too long
          title={text} // Show full text on hover
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
