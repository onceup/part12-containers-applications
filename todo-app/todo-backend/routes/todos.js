const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { getAsync, setAsync } = require('../redis/index')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const getCurrentTodos = await getAsync('todos');
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  if (getCurrentTodos === null) {
    const firstTodos = await setAsync('todos', '1');
  } else {
    const addTodos = await setAsync('todos', parseInt(getCurrentTodos) + 1);
  };
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = await Todo.findById(req.todo.id)
  res.send(todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body
  const updatedTodo = await Todo.findByIdAndUpdate(
      req.todo._id,
      {
        text: text || req.todo.text,
        done: done || req.todo.done,
      },
      { new: true }
  )
  res.send(updatedTodo).status(200)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
