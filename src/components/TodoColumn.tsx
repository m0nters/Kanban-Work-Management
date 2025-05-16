import React from "react";
import TodoCard from "./TodoCard";
import DropArea from "./DropArea";
import { Todo } from "../App";

interface TodoColumnProps {
  columnId: string;
  todos: Todo[];
  title: string;
  activeCard: number | null;
  onDragStart: (todoId: string) => void;
  onDragEnd: () => void;
  onDrop: (columnId: string, index: number) => void;
  onDelete: (id: string) => void;
  onUpdateTags: (todoId: string, tag: string) => void;
  onUpdateText: (todoId: string, newText: string) => void;
  availableTags: string[];
  onEditTag: (oldText: string, newText: string) => void;
}

const TodoColumn: React.FC<TodoColumnProps> = ({
  columnId,
  todos,
  title,
  activeCard,
  onDragStart,
  onDragEnd,
  onDrop,
  onDelete,
  onUpdateTags,
  onUpdateText,
  availableTags,
  onEditTag,
}) => {
  // Get badge color based on column
  const getBadgeColor = () => {
    switch (columnId) {
      case "todo":
        return "bg-blue-500";
      case "doing":
        return "bg-yellow-500";
      case "done":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-[200px]">
      {/* Column header with task count */}
      <div className="flex items-center justify-start mb-4 bg-gray-200 py-2 px-3 rounded">
        <h2 className="text-lg font-semibold mr-2">{title}</h2>
        <span
          className={`${getBadgeColor()} text-white text-xs font-medium px-2.5 py-0.5 rounded-full`}
        >
          {todos.length}
        </span>
      </div>

      {/* First drop area at top */}
      <DropArea
        isVisible={activeCard !== null}
        index={0}
        onDrop={() => onDrop(columnId, 0)}
      />

      {todos.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No tasks</div>
      ) : (
        todos.map((todo, index) => (
          <div key={todo.id} className="mb-2">
            <TodoCard
              todo={todo}
              onDragStart={() => onDragStart(todo.id)}
              onDragEnd={onDragEnd}
              onDelete={() => onDelete(todo.id)}
              onUpdateTags={onUpdateTags}
              onUpdateText={onUpdateText}
              availableTags={availableTags}
              onEditTag={onEditTag}
            />

            {/* Drop area after each item */}
            <DropArea
              isVisible={activeCard !== null}
              index={index + 1}
              onDrop={() => onDrop(columnId, index + 1)}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default TodoColumn;
