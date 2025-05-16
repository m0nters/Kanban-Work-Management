import { useEffect, useState } from "react";
import TodoColumn from "./components/TodoColumn";

type Status = "todo" | "doing" | "done";

export interface Todo {
  id: string;
  text: string;
  status: Status;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return [];
  });

  const [input, setInput] = useState("");
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add new todo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: input.trim(),
      status: "todo",
    };

    setTodos([...todos, newTodo]);
    setInput("");
  };

  // Delete todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Handle drag and drop between columns
  const handleDragStart = (todoId: string) => {
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);
    setActiveCard(todoIndex);
  };

  const handleDragEnd = () => {
    setActiveCard(null);
  };

  const handleDrop = (targetColumnId: string, targetIndex: number) => {
    if (activeCard === null) return;

    // Remove the item from its original position
    const updatedTodos = [...todos]; // we don't mutate directly the state
    const [activeTodo] = updatedTodos.splice(activeCard, 1);

    // If the todo is dropped in the same column
    if (activeTodo.status === targetColumnId) {
      const currentTodoIndex = todosByStatus[
        targetColumnId as Status
      ].findIndex((t) => t.id === activeTodo.id);

      // If dropping in same position or right after itself, do nothing
      if (
        currentTodoIndex === targetIndex ||
        currentTodoIndex === targetIndex - 1
      ) {
        setActiveCard(null);
        return;
      }

      // Decrement target index because the item's removal shifts indices down
      if (currentTodoIndex < targetIndex) {
        targetIndex--;
      }
    }

    // Create the updated todo with possibly new status
    const newTodo = {
      ...activeTodo,
      status: targetColumnId as Status,
    };

    // Get todos in the target column after removal
    const targetColumnTodos = updatedTodos.filter(
      (t) => t.status === targetColumnId
    );

    // Insert at beginning of the target column
    if (targetIndex === 0) {
      const firstTargetColumnIndex = updatedTodos.findIndex(
        (t) => t.status === targetColumnId
      );
      if (firstTargetColumnIndex === -1) {
        updatedTodos.push(newTodo);
      } else {
        updatedTodos.splice(firstTargetColumnIndex, 0, newTodo);
      }
    }
    // Insert at a specific position
    else if (targetIndex < targetColumnTodos.length) {
      // Find the todo that should appear before our dropped item
      const targetTodo = targetColumnTodos[targetIndex - 1];
      const insertAtIndex = updatedTodos.findIndex(
        (t) => t.id === targetTodo.id
      );
      updatedTodos.splice(insertAtIndex + 1, 0, newTodo);
    }
    // Add to the end of the column
    else {
      updatedTodos.push(newTodo);
    }

    setTodos(updatedTodos);
    setActiveCard(null);
  };

  // Filter todos by status for easier to work with
  const todosByStatus = {
    todo: todos.filter((todo) => todo.status === "todo"),
    doing: todos.filter((todo) => todo.status === "doing"),
    done: todos.filter((todo) => todo.status === "done"),
  };

  return (
    <div className="p-6 my-8">
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
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-md transition-colors cursor-pointer"
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
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
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
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
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
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onDelete={deleteTodo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
