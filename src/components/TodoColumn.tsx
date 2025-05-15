import React from "react";
import TodoCard from "./TodoCard";
import DropArea from "./DropArea";

interface Todo {
  id: number;
  text: string;
  status: "todo" | "doing" | "done";
  tags?: string[]; // Make tags optional to avoid any potential issues
}

interface TodoColumnProps {
  columnId: string;
  todos: Todo[];
  title: string; // Add title prop to display column name
  activeCard: number | null;
  dragOver: { columnId: string; index: number } | null;
  onDragStart: (todoId: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, columnId: string, index: number) => void;
  onDragLeave: () => void;
  onDrop: (columnId: string, index: number) => void;
  onDelete: (id: number) => void;
}

const TodoColumn: React.FC<TodoColumnProps> = ({
  columnId,
  todos,
  title,
  activeCard,
  dragOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onDelete,
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
        dragOver={dragOver?.columnId === columnId && dragOver?.index === 0}
        index={0}
        onDragOver={(e) => onDragOver(e, columnId, 0)}
        onDragLeave={onDragLeave}
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
              onDelete={onDelete}
            />

            {/* Drop area after each item */}
            <DropArea
              isVisible={activeCard !== null}
              dragOver={
                dragOver?.columnId === columnId && dragOver?.index === index + 1
              }
              index={index + 1}
              onDragOver={(e) => onDragOver(e, columnId, index + 1)}
              onDragLeave={onDragLeave}
              onDrop={() => onDrop(columnId, index + 1)}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default TodoColumn;
