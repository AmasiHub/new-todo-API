require("dotenv").config();

const express = require('express');
const app = express();
const cors = require("cors"); //cors


app.use(express.json()); // Parse JSON bodies
app.use(cors("*"));

// Initial Data
let nextId = 5; // Starting ID for new todos
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: "Learn Express", completed: true },
  { id: 4, task: "Deploy API", completed: true },
];



// GET All – Read
app.get("/todos", (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

//  CREATE/VALIDATE  TODO (POST)
// =======================
app.post("/todos", validateTodo, (req, res) => {
  const newTodo = {
    id: nextId++,
    task: req.body.task,
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

function validateTodo(req, res, next) {
  const { task } = req.body;

  if (!task || typeof task !== "string" || task.trim() === "") {
    return res.status(400).json({
      message: "Task is required and must be a non-empty string"
    });
  }

  next();
}


//  GET COMPLETED TODOS
app.get("/todos/completed", (req, res) => {
  const completed = todos.filter(t => t.completed === true);
  res.status(200).json(completed);
});


// GET ACTIVE TODOS
app.get("/todos/active", (req, res) => {
  const active = todos.filter(t => t.completed === false);
  res.status(200).json(active);
});


// GET TODO BY ID
app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.status(200).json(todo);
});


// PATCH Update – Partial
app.patch("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});


// DELETE Remove
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;

  todos = todos.filter(t => t.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.status(204).send(); // No content
});


app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT; 
app.listen(PORT,() => console.log('API live on port ${PORT}'));
