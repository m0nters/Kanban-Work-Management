import React, { useState, useRef, useEffect } from "react";
import { Bars3Icon, TrashIcon, TagIcon } from "@heroicons/react/16/solid";
import { useTodoContext } from "../contexts/TodoContext";
import TagChip from "./TagChip";

interface TodoCardProps {
  todo: {
    id: string;
    text: string;
    status: string;
    tags: string[];
  };
}

const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const {
    tags: availableTags,
    handleDragStart,
    handleDragEnd,
    updateTodoText,
    updateTodoTags,
    deleteTodo,
  } = useTodoContext();

  const [showTagSelector, setShowTagSelector] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [dragHandle, setDragHandle] = useState(false); // Track if drag started from handle

  const tagSelectorRef = useRef<HTMLDivElement>(null);
  const tagButtonRef = useRef<HTMLButtonElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside the tag selector
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showTagSelector &&
        tagSelectorRef.current &&
        !tagSelectorRef.current.contains(event.target as Node) &&
        tagButtonRef.current &&
        !tagButtonRef.current.contains(event.target as Node)
      ) {
        setShowTagSelector(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && showTagSelector) {
        setShowTagSelector(false);
      }
    }

    // Add event listener when selector is visible
    if (showTagSelector) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showTagSelector]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  // Save edited text
  const saveEdit = () => {
    if (editText.trim() !== "") {
      updateTodoText(todo.id, editText);
      setIsEditing(false);
    } else {
      // If empty, revert to original
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

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
      draggable={dragHandle} // Only draggable when not editing and handle is being used
      onDragStart={() => handleDragStart(todo.id)}
      onDragEnd={() => {
        handleDragEnd();
        setIsDragging(false);
        setDragHandle(false);
      }}
      className={`flex flex-col p-3 bg-white rounded-md shadow-sm border-l-4  
      hover:shadow-md ${getStatusColor()} ${
        isDragging && "opacity-50"
      } transition-all`}
    >
      {/* Card header content */}
      <div className="flex items-start mb-2">
        <div
          className="pr-3 text-gray-500 cursor-move"
          onMouseDown={() => {
            setDragHandle(true);
            setIsDragging(true);
          }}
          onMouseUp={() => {
            setDragHandle(false);
            setIsDragging(false);
          }}
          title="Drag to move"
        >
          <Bars3Icon className="h-5 w-5" />
        </div>

        {/* Editable text */}
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") {
                setEditText(todo.text);
                setIsEditing(false);
              }
            }}
            className="flex-1 ml-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <span
            className="flex-1 ml-1 text-gray-800 cursor-text"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.text}
          </span>
        )}

        <button
          ref={tagButtonRef}
          onClick={() => setShowTagSelector(!showTagSelector)}
          className="mr-2 bg-gray-100 hover:bg-gray-200 p-1 rounded cursor-pointer"
          title="Manage Tags"
        >
          <TagIcon className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm transition-colors cursor-pointer"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Tags display */}
      {todo.tags.length > 0 && !showTagSelector && (
        <div
          onDoubleClick={() => setShowTagSelector(true)}
          className="flex flex-wrap gap-1 pl-8 mt-1 cursor-pointer select-none"
        >
          {todo.tags.map((tag) => (
            <TagChip key={tag} text={tag} isSelected={true} mode="read-only" />
          ))}
        </div>
      )}

      {/* Tag selector */}
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
                mode="toggle-only"
                onClick={() => updateTodoTags(todo.id, tag)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoCard;
