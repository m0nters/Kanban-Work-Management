import { useEffect, useRef, useState } from "react";
import TodoColumn from "./components/TodoColumn";

interface Todo {
  id: number;
  text: string;
  status: "todo" | "doing" | "done"; // Replace 'completed' with 'status'
  tags: string[];
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return [];
  });

  const [tags, setTags] = useState<string[]>(() => {
    const savedTags = localStorage.getItem("tags");
    if (savedTags) {
      return JSON.parse(savedTags);
    }
    return [];
  });

  const [input, setInput] = useState("");
  const [newTag, setNewTag] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<{
    columnId: string;
    index: number;
  } | null>(null);
  const newTagInputRef = useRef<HTMLInputElement>(null);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  // Add new todo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      status: "todo",
      tags: [...selectedTags], // Add selected tags to the new todo
    };

    setTodos([...todos, newTodo]);
    setInput("");
    setSelectedTags([]); // Clear selected tags after creating todo
  };

  // Add a new tag
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() === "" || tags.includes(newTag.trim())) return;

    setTags([...tags, newTag.trim()]);
    setNewTag("");
  };

  // Remove a tag from the list and from all todos
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));

    // Also remove this tag from all todos
    setTodos(
      todos.map((todo) => ({
        ...todo,
        tags: todo.tags.filter((tag) => tag !== tagToRemove),
      }))
    );

    // Remove from selected tags if present
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  // Toggle a tag selection for a new todo
  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  // Update todo tags
  const updateTodoTags = (todoId: number, tagToToggle: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          const updatedTags = todo.tags.includes(tagToToggle)
            ? todo.tags.filter((tag) => tag !== tagToToggle)
            : [...todo.tags, tagToToggle];

          return { ...todo, tags: updatedTags };
        }
        return todo;
      })
    );
  };

  // Delete todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Handle drag and drop between columns
  const handleDragStart = (todoId: number) => {
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);
    setActiveCard(todoIndex);
  };

  const handleDragEnd = () => {
    setActiveCard(null);
    setDragOver(null);
  };

  const handleDragOver = (
    e: React.DragEvent,
    columnId: string,
    index: number
  ) => {
    e.preventDefault();
    setDragOver({ columnId, index });
  };

  const handleDrop = (targetColumnId: string, targetIndex: number) => {
    if (activeCard === null) return;

    const activeTodo = todos[activeCard];

    // Skip if dropping in the same position or right after itself in the same column
    if (activeTodo.status === targetColumnId) {
      const sameColumnIndex = todos
        .filter((t) => t.status === targetColumnId)
        .findIndex((t) => t.id === activeTodo.id);

      // If dropping in same position or right after itself, do nothing
      if (
        sameColumnIndex === targetIndex ||
        sameColumnIndex === targetIndex - 1
      ) {
        setActiveCard(null);
        setDragOver(null);
        return;
      }
    }

    const updatedTodos = [...todos];

    // Remove the item from its original position
    updatedTodos.splice(activeCard, 1);

    // Find the new target index (accounting for the removed item)
    let adjustedTargetIndex = targetIndex;
    const targetColumnTodos = updatedTodos.filter(
      (t) => t.status === targetColumnId
    );

    // Add it in the new position with updated status
    const newTodo = {
      ...activeTodo,
      status: targetColumnId as "todo" | "doing" | "done",
    };

    // Insert at beginning of the target column's todos
    if (adjustedTargetIndex === 0) {
      const firstTargetColumnIndex = updatedTodos.findIndex(
        (t) => t.status === targetColumnId
      );
      if (firstTargetColumnIndex === -1) {
        updatedTodos.push(newTodo);
      } else {
        updatedTodos.splice(firstTargetColumnIndex, 0, newTodo);
      }
    }
    // Insert at the specified position
    else if (adjustedTargetIndex <= targetColumnTodos.length) {
      // Find the index of the todo at the target position in the filtered array
      const targetTodo = targetColumnTodos[adjustedTargetIndex - 1];
      const targetIndex = updatedTodos.findIndex((t) => t.id === targetTodo.id);
      updatedTodos.splice(targetIndex + 1, 0, newTodo);
    }
    // Add to the end of the column
    else {
      updatedTodos.push(newTodo);
    }

    setTodos(updatedTodos);
    setActiveCard(null);
    setDragOver(null);
  };

  // Filter todos by status
  const todosByStatus = {
    todo: todos.filter((todo) => todo.status === "todo"),
    doing: todos.filter((todo) => todo.status === "doing"),
    done: todos.filter((todo) => todo.status === "done"),
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md my-8">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Work Management
      </h1>

      {/* Add todo form */}
      <form onSubmit={handleSubmit} className="flex mb-6 max-w-lg mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-md transition-colors"
        >
          Add
        </button>
      </form>

      {/* Kanban columns */}
      <div className="grid grid-cols-3 gap-6">
        {/* To Do column */}
        <div className="bg-gray-100 rounded-md p-4">
          <TodoColumn
            columnId="todo"
            title="To Do"
            todos={todosByStatus.todo}
            activeCard={activeCard}
            dragOver={dragOver}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={() => setDragOver(null)}
            onDrop={handleDrop}
            onDelete={deleteTodo}
          />
        </div>

        {/* Doing column */}
        <div className="bg-gray-100 rounded-md p-4">
          <TodoColumn
            columnId="doing"
            title="In Progress"
            todos={todosByStatus.doing}
            activeCard={activeCard}
            dragOver={dragOver}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={() => setDragOver(null)}
            onDrop={handleDrop}
            onDelete={deleteTodo}
          />
        </div>

        {/* Done column */}
        <div className="bg-gray-100 rounded-md p-4">
          <TodoColumn
            columnId="done"
            title="Done"
            todos={todosByStatus.done}
            activeCard={activeCard}
            dragOver={dragOver}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={() => setDragOver(null)}
            onDrop={handleDrop}
            onDelete={deleteTodo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
