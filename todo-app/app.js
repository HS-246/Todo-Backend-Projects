const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/todos", async (request, response) => {
  await Todo.showList();

  return response.status(200).send("All Okay");
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

app.delete("/todos/:id", (request, response) => {
  console.log("Deleteing todo with id: ", request.params.id);
  return response;
});

module.exports = app;
