import React, { useState, useRef, useEffect } from "react"; // Add imports
import { Bars3Icon, TrashIcon, TagIcon } from "@heroicons/react/16/solid";
import { Todo } from "../App";
import TagChip from "./TagChip";

interface TodoCardProps {
  todo: Todo;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDelete: () => void;
  onUpdateTags: (todoId: string, tag: string) => void;
  availableTags: string[];
}

const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onDragStart,
  onDragEnd,
  onDelete,
  onUpdateTags,
  availableTags,
}) => {
  const [showTagSelector, setShowTagSelector] = useState(false);
  const tagSelectorRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the tag selector
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showTagSelector &&
        tagSelectorRef.current &&
        !tagSelectorRef.current.contains(event.target as Node)
      ) {
        setShowTagSelector(false);
      }
    }

    // Add event listener when selector is visible
    if (showTagSelector) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTagSelector]);

  // Get the appropriate color based on status
  const getStatusColor = () => {
    switch (todo.status) {
      case "todo":
        return "border-l-blue-500";
      case "doing":
        return "border-l-yellow-500";
      case "done":
        return "border-l-green-500";
      default:
        return "";
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`flex flex-col p-3 bg-white border rounded-md border-l-4 ${getStatusColor()} 
        cursor-move hover:shadow-md transition-all`}
    >
      {/* Card header content stays the same */}
      <div className="flex items-start mb-2">
        <div className="pr-3 text-gray-500">
          <Bars3Icon className="h-5 w-5" />
        </div>
        <span className="flex-1 ml-1 text-gray-800">{todo.text}</span>
        <button
          onClick={() => setShowTagSelector(!showTagSelector)}
          className="mr-2 bg-gray-100 hover:bg-gray-200 p-1 rounded cursor-pointer"
          title="Manage Tags"
        >
          <TagIcon className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm transition-colors cursor-pointer"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Tags display */}
      {todo.tags.length > 0 && !showTagSelector && (
        <div className="flex flex-wrap gap-1 ml-8 mt-1">
          {todo.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Tag selector with ref */}
      {showTagSelector && (
        <div
          ref={tagSelectorRef}
          className="ml-8 mt-2 p-2 bg-gray-50 rounded border cursor-default"
        >
          <div className="text-xs text-gray-500 mb-1">
            Click to toggle tags:
          </div>
          <div className="flex flex-wrap gap-1">
            {availableTags.map((tag) => (
              <TagChip
                key={tag}
                text={tag}
                isSelected={todo.tags.includes(tag)}
                onClick={() => onUpdateTags(todo.id, tag)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoCard;
