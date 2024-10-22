// models/todo.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
    }

    static async overdue() {
      const overdueTodos = await Todo.findAll({
        where: {
          duedate: {
            gt: new Date(),
          },
        },
      });
      const overdueTodosList = overdueTodos
        .map((item) => item.toDisplayableString())
        .join("\n");
      return overdueTodosList;
    }

    static async dueToday() {
      const dueTodos = await Todo.findAll({
        where: {
          duedate: {
            eq: new Date(),
          },
        },
      });
      const dueTodosList = dueTodos
        .map((item) => item.toDisplayableString())
        .join("\n");
      return dueTodosList;
    }

    static async dueLater() {
      const LaterTodos = await Todo.findAll({
        where: {
          duedate: {
            lt: new Date(),
          },
        },
      });
      const LaterTodosList = LaterTodos.map((item) =>
        item.toDisplayableString()
      ).join("\n");
      return LaterTodosList;
    }

    static async markAsComplete(id) {
      Todo.update(
        {
          completed: true,
        },
        {
          where: {
            id,
          },
        }
      );
    }

    toDisplayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
