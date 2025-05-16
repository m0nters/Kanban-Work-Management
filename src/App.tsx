import { useEffect, useRef, useState } from "react";
import TodoColumn from "./components/TodoColumn";
import TagChip from "./components/TagChip";

type Status = "todo" | "doing" | "done";

export interface Todo {
  id: string;
  text: string;
  status: Status;
  tags: string[];
}

function App() {
  // Load todos from localStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return [];
  });

  // Load tags from localStorage
  const [tags, setTags] = useState<string[]>(() => {
    const savedTags = localStorage.getItem("tags");
    if (savedTags) {
      return JSON.parse(savedTags);
    }
    return [];
  });

  const [input, setInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const tagFormRef = useRef<HTMLFormElement>(null);

  // Save todos and tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  // Add a new effect to handle clicks outside the tag form
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isAddingTag &&
        tagFormRef.current &&
        !tagFormRef.current.contains(event.target as Node)
      ) {
        setIsAddingTag(false);
        setTagInput("");
      }
    }

    // Add event listener when isAddingTag is true
    if (isAddingTag) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddingTag]);

  // Add new todo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: input.trim(),
      status: "todo",
      tags: [...selectedTags],
    };

    setTodos([...todos, newTodo]);
    setInput("");
    setSelectedTags([]);
  };

  // Update todo card's text
  const updateTodoText = (todoId: string, newText: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, text: newText };
        }
        return todo;
      })
    );
  };

  // Update tag text globally
  const updateTagText = (oldText: string, newText: string) => {
    // Check if the new tag name already exists
    if (tags.includes(newText)) {
      alert("This tag already exists!");
      return;
    }

    // Update the tags array
    setTags(tags.map((tag) => (tag === oldText ? newText : tag)));

    // Update selectedTags array
    setSelectedTags(
      selectedTags.map((tag) => (tag === oldText ? newText : tag))
    );

    // Update all todos that have this tag
    setTodos(
      todos.map((todo) => ({
        ...todo,
        tags: todo.tags.map((tag) => (tag === oldText ? newText : tag)),
      }))
    );
  };

  // Add new tag
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim() === "") return;

    // Only add if the tag doesn't already exist
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }

    setTagInput("");
    setIsAddingTag(false);
  };

  // Delete tag
  const deleteTag = (tagToDelete: string) => {
    // Remove tag from tags list
    setTags(tags.filter((tag) => tag !== tagToDelete));

    // Remove tag from selectedTags
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToDelete));

    // Remove tag from all todos that have it
    setTodos(
      todos.map((todo) => ({
        ...todo,
        tags: todo.tags.filter((tag) => tag !== tagToDelete),
      }))
    );
  };

  // Toggle tag selection for new todo
  const toggleTagSelection = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Update todo tags
  const updateTodoTags = (todoId: string, tagToToggle: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          const updatedTags = todo.tags.includes(tagToToggle)
            ? todo.tags.filter((t) => t !== tagToToggle)
            : [...todo.tags, tagToToggle];

          return { ...todo, tags: updatedTags };
        }
        return todo;
      })
    );
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
      <div className="max-w-lg mx-auto mb-6">
        <form onSubmit={handleSubmit} className="flex mb-3">
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

        {/* Tag selection area */}
        <div>
          <div className="text-sm text-gray-600 mb-2">Select tags:</div>
          <div className="flex flex-wrap gap-4 items-center">
            {tags.map((tag) => (
              <TagChip
                key={tag}
                text={tag}
                isSelected={selectedTags.includes(tag)}
                onClick={() => toggleTagSelection(tag)}
                onDelete={() => deleteTag(tag)}
                onEdit={updateTagText}
              />
            ))}

            {isAddingTag ? (
              <form
                ref={tagFormRef}
                onSubmit={handleAddTag}
                className="flex items-center"
              >
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="New tag..."
                  className="border border-gray-300 rounded-l-md p-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-2 py-1 text-sm rounded-r-md cursor-pointer"
                >
                  Add
                </button>
              </form>
            ) : (
              <TagChip
                text="Add Tag"
                isAddButton={true}
                onClick={() => setIsAddingTag(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            onUpdateTags={updateTodoTags}
            onUpdateText={updateTodoText}
            availableTags={tags}
            onEditTag={updateTagText}
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
            onUpdateTags={updateTodoTags}
            onUpdateText={updateTodoText}
            availableTags={tags}
            onEditTag={updateTagText}
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
            onUpdateTags={updateTodoTags}
            onUpdateText={updateTodoText}
            availableTags={tags}
            onEditTag={updateTagText}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
