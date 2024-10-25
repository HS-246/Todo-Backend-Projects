"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static async markasComplete(id) {
      await Todo.update(
        {
          completed: true,
        },
        {
          where: {
            id,
          },
        },
      );

      return Todo.findByPk(id);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      await this.overdue();
      console.log("\n");

      console.log("Due Today");
      await this.dueToday();
      console.log("\n");

      console.log("Due Later");
      await this.dueLater();
    }

    static async overdue() {
      const overdueTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
        },
      });
      const overdueTodosList = overdueTodos
        .map((item) => item.toDisplayableString())
        .join("\n");
      console.log(overdueTodosList);
    }

    static async dueToday() {
      const dueTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
        },
      });
      const dueTodosList = dueTodos
        .map((item) => item.toDisplayableString())
        .join("\n");
      console.log(dueTodosList);
    }

    static async dueLater() {
      const LaterTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
      });
      const LaterTodosList = LaterTodos.map((item) =>
        item.toDisplayableString(),
      ).join("\n");
      console.log(LaterTodosList);
    }

    toDisplayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.duedate}`;
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
    },
  );
  return Todo;
};
