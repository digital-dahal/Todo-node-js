const asyncHandler = require("../middleware/asyncHandler");
const messageHandler = require("../utils/messageHandler");
const factory = require("../middleware/factoryHandler");
const { Todo, validateTodo } = require("../models/ToDo");
const { User } = require("../models/User");

module.exports.createTodo = asyncHandler(async (req, res) => {
  const { error } = validateTodo(req.body);
  if (error)
    return res.status(404).send(messageHandler(false, error.message, 404));
  const userId = req.params.userId;
  const doc = await User.findById(userId);
  if (!doc) {
    return res.status(404).send(messageHandler(false, "User not found", 404));
  }
  const todo = await Todo.create({
    ...req.body,
    user: userId,
  });
  await User.findByIdAndUpdate(userId, {
    $push: { todos: todo },
  });
  const todos = await Todo.find({ userId }).populate({
    path: "user",
    select: "name email createdAt updatedAt",
  });

  const completedTodosCount = todos.filter((todo) => todo.status === true).length;
  const pendingTodosCount = todos.filter(
    (todo) => todo.status === false
  ).length;

  const todosObj = {
    completedTodosCount,
    todos,
    pendingTodosCount,
  };
  return res.status(200).send(messageHandler(true, { data: todosObj }, 200));
});

module.exports.getTodos = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const doc = await User.findById(userId);
  if (!doc) {
    return res.status(404).send(messageHandler(false, "User not found", 404));
  }
  const todos = await Todo.find({ user: userId }).populate({
    path: "user",
    select: "name email createdAt updatedAt",
  });

  const completedTodosCount = todos.filter((todo) => todo.status === true).length;
  const pendingTodosCount = todos.filter(
    (todo) => todo.status === false
  ).length;

  const todosObj = {
    completedTodosCount,
    todos,
    pendingTodosCount,
  };
  return res.status(200).send(messageHandler(true, { data: todosObj }, 200));
});

module.exports.updateTodo = asyncHandler(async (req, res) => {
  const todoId = req.params.todoId;
  const doc = await Todo.findById(todoId);
  if (!doc) {
    return res.status(404).send(messageHandler(false, "Todo Not Found", 404));
  }
  await Todo.findByIdAndUpdate(todoId, {
    ...req.body,
  });
  const todos = await Todo.find({}).populate({
    path: "user",
    select: "name email createdAt updatedAt",
  });

  const completedTodosCount = todos.filter((todo) => todo.status === true).length;
  const pendingTodosCount = todos.filter(
    (todo) => todo.status === false
  ).length;

  const todosObj = {
    completedTodosCount,
    todos,
    pendingTodosCount,
  };
  return res.status(200).send(messageHandler(true, { data: todosObj }, 200));
});

module.exports.deleteTodo = asyncHandler(async (req, res) => {
  const todoId = req.params.todoId;
  const doc = await Todo.findById(todoId);
  if (!doc) {
    return res.status(404).send(messageHandler(false, "Todo Not Found", 404));
  }
  await Todo.findByIdAndDelete(todoId);
  const todos = await Todo.find({}).populate({
    path: "user",
    select: "name email createdAt updatedAt",
  });

  const completedTodosCount = todos.filter((todo) => todo.status === true).length;
  const pendingTodosCount = todos.filter(
    (todo) => todo.status === false
  ).length;

  const todosObj = {
    completedTodosCount,
    todos,
    pendingTodosCount,
  };
  return res.status(200).send(messageHandler(true, { data: todosObj }, 200));
});



module.exports.getCompletedTodos = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const doc = await User.findById(userId);
  if (!doc) {
    return res.status(404).send(messageHandler(false, "User not found", 404));
  }
  const todos = await Todo.find({ user: userId }).populate({
    path: "user",
    select: "name email createdAt updatedAt",
  });
  const completedTodos = todos.filter((todo) => todo.status === true);
  const pendingTodosCount = todos.filter(
    (todo) => todo.status === false
  ).length;
  const completedTodosCount = completedTodos.length;
  const todosObj = {
    completedTodosCount,
    completedTodos,
    pendingTodosCount,
  };
  return res.status(200).send(messageHandler(true, { data: todosObj }, 200));
});
