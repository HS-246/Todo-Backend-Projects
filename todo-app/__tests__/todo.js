/* eslint-disable no-undef */
const request = require("supertest");
const cheerio = require("cheerio");

const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("signup working", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "Test",
      lastName: "User A",
      email: "testuser@gmail.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("respond to /todos with json", async () => {
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);

    const response = await agent.post("/todos").send({
      title: "buy milk",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("marks as complete", async () => {
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);

    await agent.post("/todos").send({
      title: "buy milk",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const latestTodoIndex = parsedGroupedResponse["Due"].length;
    const latestTodo = parsedGroupedResponse["Due"][latestTodoIndex - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markAsCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}/update`)
      .send({
        _csrf: csrfToken,
      });
    const parsedUpdateResponse = JSON.parse(markAsCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  // test("check deletion", async () => {
  //   const res = await agent.get("/");
  //   const csrfToken = extractCsrfToken(res);

  //   const response = await agent.post("/todos").send({
  //     title: "buy milk",
  //     dueDate: new Date().toISOString(),
  //     _csrf: csrfToken,
  //   });
  //   const parsedResponse = JSON.parse(response.text);
  //   const todoID = parsedResponse.id;

  //   expect(parsedResponse.id).toBeDefined();

  //   const deletedResponse = await agent.delete(`/todos/${todoID}`).send({
  //     _csrf: csrfToken,
  //   });
  //   const parsedDeletedResponse = JSON.parse(deletedResponse.text);
  //   expect(parsedDeletedResponse).toBe(true);
  // });
});
