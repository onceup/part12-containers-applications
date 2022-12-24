const express = require('express');
const router = express.Router();
const { getAsync } = require('../redis/index')

router.get('/', async (request, response) => {

    const showAddedTodos = await getAsync('todos');

    if (showAddedTodos === null) {
        response.send({
            added_todos: 0
        })
    } else {
        response.send({
            added_todos: showAddedTodos
        })
    };
});

module.exports = router;
