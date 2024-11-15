function taskReducer(tasks, action) {
  console.log("taskreducer");
  switch (action.type) {
    // eslint-disable-next-line no-lone-blocks
    case "ADD_TASK": {
      return [
        ...tasks,
        {
          title: action.title,
          description: action.description,
          completed: false,
          priority: action.priority,
          dueDate: action.dueDate,
        },
      ];
    }
    case "SET_TASK": {
      return action.payload;
    }
    case "SET_EDIT_TASK": {
      return tasks.map((task, index) => {
        if (index === action.id) {
          return {
            ...task,
            ...action.payload,
          };
        }
        return task;
      });
    }
    case "REMOVE_TASK": {
      return tasks.filter((task, index) => index !== action.id);
    }
    case "MARK_DONE": {
      return tasks.map((task, index) => {
        if (index === action.id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    }
    default: {
      throw Error("Unknown Action" + action.type);
    }
  }
}

export default taskReducer;
