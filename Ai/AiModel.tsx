const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const codeGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});

export const GenAiCode = model.startChat({
  generationConfig : codeGenerationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Generate a to do app : Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, \nwithout any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. \n\nReturn the response in JSON format with the following schema:\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\n\nEnsure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file's code should be included in the code field. \n\n- When necessary, you may use the following packages: date-fns, react-chartjs-2, firebase, @google/generative-ai.\n- Use placeholder images from https://archive.org/download/placeholder-image/placeholder-image.jpg.\n- Add emoji icons whenever needed to enhance user experience.\n- All designs should be beautiful, fully-featured, and production-ready.\n- Use icons from lucide-react for logos.\n- Use stock photos from Unsplash where appropriate, linking to valid URLs.\n   \n"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"projectTitle\": \"React To-Do App\",\n  \"explanation\": \"A simple yet functional to-do application built with React and styled using Tailwind CSS. It allows users to add, edit, complete, and delete tasks. No external libraries are used for styling except for lucide-react for icons.\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"import React, { useState, useEffect } from 'react';\\nimport Header from './components/Header';\\nimport TodoList from './components/TodoList';\\nimport AddTodo from './components/AddTodo';\\nimport { Trash } from 'lucide-react';\\n\\nfunction App() {\\n  const [todos, setTodos] = useState(() => {\\n    const storedTodos = localStorage.getItem('todos');\\n    return storedTodos ? JSON.parse(storedTodos) : [];\\n  });\\n\\n  useEffect(() => {\\n    localStorage.setItem('todos', JSON.stringify(todos));\\n  }, [todos]);\\n\\n  const addTodo = (text) => {\\n    setTodos([...todos, { id: Date.now(), text, completed: false }]);\\n  };\\n\\n  const toggleComplete = (id) => {\\n    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));\\n  };\\n\\n  const deleteTodo = (id) => {\\n    setTodos(todos.filter(todo => todo.id !== id));\\n  };\\n\\n  const clearCompleted = () => {\\n    setTodos(todos.filter(todo => !todo.completed));\\n  };\\n\\n  return (\\n    <div className=\\\"bg-gray-100 min-h-screen\\\">\\n      <div className=\\\"container mx-auto p-4\\\">\\n        <Header />\\n        <AddTodo addTodo={addTodo} />\\n        <TodoList todos={todos} toggleComplete={toggleComplete} deleteTodo={deleteTodo} />\\n        {todos.filter(todo => todo.completed).length > 0 && (\\n          <button\\n            className=\\\"bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 flex items-center gap-2\\\"\\n            onClick={clearCompleted}\\n          >\\n            <Trash size={16}/> Clear Completed\\n          </button>\\n        )}\\n      </div>\\n    </div>\\n  );\\n}\\n\\nexport default App;\"\n    },\n    \"/components/Header.js\": {\n      \"code\": \"import React from 'react';\\n\\nfunction Header() {\\n  return (\\n    <div className=\\\"text-center mb-8\\\">\\n      <h1 className=\\\"text-3xl font-bold text-gray-800\\\">My To-Do List 📝</h1>\\n      <p className=\\\"text-gray-500\\\">Get organized and stay productive!</p>\\n    </div>\\n  );\\n}\\n\\nexport default Header;\"\n    },\n    \"/components/TodoList.js\": {\n      \"code\": \"import React from 'react';\\n\\nfunction TodoList({ todos, toggleComplete, deleteTodo }) {\\n  return (\\n    <ul>\\n      {todos.map(todo => (\\n        <li key={todo.id} className=\\\"flex justify-between items-center py-2 px-4 bg-white rounded shadow mb-2\\\">\\n          <div className=\\\"flex items-center\\\">\\n            <input\\n              type=\\\"checkbox\\\"\\n              id={`todo-${todo.id}`}\\n              checked={todo.completed}\\n              onChange={() => toggleComplete(todo.id)}\\n              className=\\\"mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500\\\"\\n            />\\n            <label htmlFor={`todo-${todo.id}`} className={`text-gray-700 ${todo.completed ? 'line-through text-gray-400' : ''}`}>\\n              {todo.text}\\n            </label>\\n          </div>\\n          <button onClick={() => deleteTodo(todo.id)} className=\\\"text-red-500 hover:text-red-700 focus:outline-none\\\">\\n            🗑️\\n          </button>\\n        </li>\\n      ))}\\n    </ul>\\n  );\\n}\\n\\nexport default TodoList;\"\n    },\n    \"/components/AddTodo.js\": {\n      \"code\": \"import React, { useState } from 'react';\\nimport { Plus } from 'lucide-react';\\n\\nfunction AddTodo({ addTodo }) {\\n  const [text, setText] = useState('');\\n\\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    if (text.trim() !== '') {\\n      addTodo(text);\\n      setText('');\\n    }\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\\"mb-4\\\">\\n      <div className=\\\"flex\\\">\\n        <input\\n          type=\\\"text\\\"\\n          className=\\\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\\\"\\n          placeholder=\\\"Add a new task...\\\"\\n          value={text}\\n          onChange={(e) => setText(e.target.value)}\\n        />\\n        <button\\n          className=\\\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline\\\"\\n          type=\\\"submit\\\"\\n        >\\n        <Plus size={16}/>  Add\\n        </button>\\n      </div>\\n    </form>\\n  );\\n}\\n\\nexport default AddTodo;\"\n    }\n  },\n  \"generatedFiles\": [\n    \"/App.js\",\n    \"/components/Header.js\",\n    \"/components/TodoList.js\",\n    \"/components/AddTodo.js\"\n  ]\n}\n```"},
      ],
    },
  ]
})

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
