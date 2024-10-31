"use strict";
// eslint-disable-next-line no-unused-vars
const { Model, Op, where } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static async Update(id) {
      //id = Number(id);
      const todo = await Todo.findByPk(id);
      console.log(`${todo.id}  ${todo.completed}`);

      await Todo.update(
        {
          completed: !todo.completed,
        },
        {
          where: {
            id,
          },
        }
      );

      return await Todo.findByPk(id);
    }

    static async delete(id) {
      const numberOfRowsDeleted = await Todo.destroy({
        where: {
          id,
        },
      });

      return numberOfRowsDeleted;
    }

    static async getAllTodos() {
      //console.log(await this.findAll());

      return await this.findAll();
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const Overdue = await this.overdue();
      console.log("\n");

      console.log("Due Today");
      const Due = await this.dueToday();
      console.log("\n");

      console.log("Due Later");
      const Later = await this.dueLater();

      console.log("Completed Items");
      const Completed = await this.completedTodos();

      return { Overdue, Due, Later, Completed };
    }

    static async completedTodos() {
      const completedTodos = await Todo.findAll({
        where: {
          completed: true,
        },
      });
      const completedList = completedTodos
        .map((item) => item.toDisplayableString())
        .join("\n");
      console.log(completedList);
      return completedTodos;
    }

    static async overdue() {
      const overdueTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
          completed: false,
        },
      });
      const overdueTodosList = overdueTodos
        .map((item) => item.toDisplayableString())
        .join("\n");
      console.log(overdueTodosList);
      return overdueTodos;
    }

    static async dueToday() {
      const dueTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
          completed: false,
        },
      });
      const dueTodosList = dueTodos
        .map((item) => item.toDisplayableString())
        .join("\n");
      console.log(dueTodosList);
      return dueTodos;
    }

    static async dueLater() {
      const LaterTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
          completed: false,
        },
      });
      const LaterTodosList = LaterTodos.map((item) =>
        item.toDisplayableString()
      ).join("\n");
      console.log(LaterTodosList);
      return LaterTodos;
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
