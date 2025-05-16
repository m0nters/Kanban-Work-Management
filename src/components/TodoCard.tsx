import React from "react";
import { Bars3Icon, TrashIcon } from "@heroicons/react/16/solid";

interface Todo {
  id: number;
  text: string;
  status: "todo" | "doing" | "done";
}

interface TodoCardProps {
  todo: Todo;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDelete: () => void;
}

const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onDragStart,
  onDragEnd,
  onDelete,
}) => {
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
      className={`flex items-center p-3 bg-white border rounded-md border-l-4 ${getStatusColor()} 
        cursor-move hover:shadow-md transition-all`}
    >
      {/* Hamburger icon */}
      <div className="pr-3 text-gray-500">
        <Bars3Icon className="h-5 w-5" />
      </div>

      {/* Todo text */}
      <span className="flex-1 ml-1 text-gray-800">{todo.text}</span>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm transition-colors cursor-pointer"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default TodoCard;
