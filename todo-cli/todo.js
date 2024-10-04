const todoList = () => {
  all = [];
  const today = new Date().toISOString().split("T")[0];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    let filtered = all.filter((item) => item.dueDate < today);
    return filtered;
  };

  const dueToday = () => {
    let filtered = all.filter((item) => item.dueDate == today);
    return filtered;
  };

  const dueLater = () => {
    let filtered = all.filter((item) => item.dueDate > today);
    return filtered;
  };

  const createItemString = (item) => {
    if (item.completed) {
      if (item.dueDate == today) return `[x] ${item.title}`;
      else return `[x] ${item.title} ${item.dueDate}`;
    } else {
      if (item.dueDate == today) return `[ ] ${item.title}`;
      else return `[ ] ${item.title} ${item.dueDate}`;
    }
  };

  const toDisplayableList = (list) => {
    const stringedList = list.map(createItemString);
    return stringedList.join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
