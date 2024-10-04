const todolist = require("../todo");

const {
  all,
  add,
  markAsComplete,
  overdue,
  dueToday,
  dueLater,
  toDisplayableList,
} = todolist();
var dateToday = new Date();
const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};

describe("First todo test suite", () => {
  beforeAll(() => {
    add({
      title: "Test todo due today",
      completed: false,
      dueDate: formattedDate(new Date()),
    });
  });
  test("should add todo", () => {
    const todoLength = all.length;
    add({
      title: "Test due Today",
      completed: false,
      dueDate: formattedDate(new Date()),
    });
    expect(all.length).toBe(todoLength + 1);
  });
  test("should mark as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("retrieve overdue items", () => {
    let itemsOverdue = overdue().length;
    let todoItem = {
      title: "Test due yesterday",
      completed: false,
      dueDate: formattedDate(
        new Date(new Date().setDate(dateToday.getDate() - 1))
      ),
    };
    add(todoItem);
    expect(overdue().length).toBe(itemsOverdue + 1);
  });
  test("retrieve items due today", () => {
    let itemsDueToday = dueToday().length;
    let todoItem = {
      title: "Test due today part 3",
      completed: false,
      dueDate: formattedDate(new Date()),
    };
    add(todoItem);
    expect(dueToday().length).toBe(itemsDueToday + 1);
  });
  test("retrieve due later items", () => {
    let itemsDueLater = dueLater().length;
    let todoItem = {
      title: "Test due later",
      completed: false,
      dueDate: formattedDate(
        new Date(new Date().setDate(dateToday.getDate() + 1))
      ),
    };

    add(todoItem);

    expect(dueLater().length).toBe(itemsDueLater + 1);
  });
});
