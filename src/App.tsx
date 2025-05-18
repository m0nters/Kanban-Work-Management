import { useEffect, useRef, useState } from "react";
import TodoColumn from "./components/TodoColumn";
import TagChip from "./components/TagChip";
import { TodoProvider, useTodoContext } from "./contexts/TodoContext";

function AppContent() {
  const {
    todosByStatus,
    tags,
    selectedTags,
    addTodo,
    addTag,
    toggleTagSelection,
  } = useTodoContext();

  const [input, setInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const tagFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isAddingTag &&
        tagFormRef.current &&
        !tagFormRef.current.contains(event.target as Node)
      ) {
        setIsAddingTag(false);
        setTagInput(""); // Clear input when closing
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isAddingTag) {
        setIsAddingTag(false);
        setTagInput(""); // Clear input when closing
      }
    }

    // Add event listener when tag form is open
    if (isAddingTag) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddingTag]);

  // Handle form submission for new todo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    addTodo(input);
    setInput("");
  };

  // Handle adding a new tag
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim() === "") return;

    addTag(tagInput);
    setTagInput("");
    setIsAddingTag(false);
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
                mode="add-button"
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
          />
        </div>

        {/* Doing column */}
        <div className="bg-gray-100 rounded-md p-4">
          <TodoColumn
            columnId="doing"
            title="In Progress"
            todos={todosByStatus.doing}
          />
        </div>

        {/* Done column */}
        <div className="bg-gray-100 rounded-md p-4">
          <TodoColumn columnId="done" title="Done" todos={todosByStatus.done} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
}

export default App;
