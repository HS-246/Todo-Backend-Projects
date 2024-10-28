const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());

//set EJS as view engine
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  const alltodos = await Todo.showList();
  if (request.accepts("html")) {
    return response.render("index", {
      alltodos,
    });
  } else {
    return response.json(alltodos);
  }
});

app.get("/todos", async (request, response) => {
  const allTodos = await Todo.showList();

  return response.status(200).json(allTodos);
});

app.post("/todos", async (request, response) => {
  console.log("Get Todo", request.body);

  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });

    return response.json(todo);
  } catch (err) {
    console.log(err);
    return response.status(422);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("Mark todo as complete with id: ", request.params.id);
  try {
    //const todo = await Todo.findByPk(request.params.id);
    const updated = await Todo.markasComplete(request.params.id);
    return response.json(updated);
  } catch (err) {
    console.log(err);
    return response.status(422);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("Deleteing todo with id: ", request.params.id);
  const deleted = await Todo.delete(request.params.id);
  if (deleted) return response.send(true);
  return response.send(false);
});

module.exports = app;
