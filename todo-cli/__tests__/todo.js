const todolist = require("../todo");

const { all, add, markAsComplete } = todolist();

describe("First todo test suite", () => {
  beforeAll(() => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
    });
  });
  test("should add todo", () => {
    const todoLength = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
    });
    expect(all.length).toBe(todoLength + 1);
  });
  test("should mark as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
});
