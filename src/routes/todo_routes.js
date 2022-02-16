const { Router } = require("express");
const todoController = require("../controller/todo__controller");

const router = Router();

router.post("/create", todoController.createTodo);
router.delete("/delete/:todoid", todoController.deleteTodo);
router.get("/getTodos", todoController.getTodos);
router.put("/update/:todoid", todoController.updateTodo);
router.get("/getTodos/query", todoController.queryTodo);

module.exports = router;