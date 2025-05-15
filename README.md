Here's a cleaned-up and rewritten version of your `README.md` that corrects the formatting issue ("Collecting workspace information") and improves clarity and flow:

# Kanban Work Management

A sleek and responsive Kanban board application built with **React**, **TypeScript**, and **TailwindCSS**. Easily manage your workflow across three columns: **To Do**, **In Progress**, and **Done**, with intuitive drag-and-drop functionality and persistent local storage.

![Kanban Board Screenshot](preview.png)

---

## 🚀 Features

- 🧩 **Kanban Layout** — Organize tasks into "To Do", "In Progress", and "Done" columns
- 🎯 **Drag and Drop** — Move tasks between columns using smooth drag-and-drop interactions
- 📝 **Task Management** — Create, categorize, and delete tasks
- 💾 **Persistent Storage** — Tasks and tags are saved in `localStorage`
- 📱 **Responsive Design** — Works on desktops, tablets, and smartphones

---

## 🛠️ Getting Started

### Prerequisites

- Node.js v16 or later
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/m0nters/Kanban-Work-Management.git
   cd kanban-work-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open in your browser**
   Visit [http://localhost:5173](http://localhost:5173)

---

## 📖 Usage Guide

### ✅ Creating a Task

1. Enter a task description in the input field
2. Select optional tags from the tag list
3. Click **"Add"** — the task will appear under **To Do**

### 🏷️ Managing Tags

- Add new tags via the tag input + "+" button
- Click tags to select/deselect when adding tasks
- Remove tags by clicking the delete icon (affects all associated tasks)

### 🔄 Moving Tasks

**Option 1: Drag and Drop**

- Click and drag a task to another column and release

**Option 2: Status Dropdown**

- Use the dropdown on a task card to change its column

### 🗑️ Deleting Tasks

- Click the trash icon on the task card

---

## 🧰 Technologies Used

- **React 19** — UI framework
- **TypeScript** — Static typing
- **TailwindCSS** — Utility-first styling
- **Vite** — Fast dev/build tool
- **localStorage API** — Persistent storage

---

## 📁 Project Structure

```bash
src/
  ├── components/
  │   ├── DropArea.tsx      # Drag and drop logic
  │   ├── TodoCard.tsx      # Task card component
  │   └── TodoColumn.tsx    # Column wrapper
  ├── App.tsx               # App root
  ├── main.tsx              # App entry point
  └── styles.css            # Global styles
```

---

## 📦 Build for Production

```bash
npm run build
```

This will create an optimized production build in the `dist/` folder. You can then deploy it to services like **Netlify**, **Vercel**, **GitHub Pages**, or any static host.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
