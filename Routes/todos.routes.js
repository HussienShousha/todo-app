const express = require('express');
const {getAllToDos, getToDoByID, saveToDo, updateToDO, deleteToDo, viewAllTodos} = require('../Controllers/todos.controller');
const {auth, restrictTo} = require('../Middleware/auth');

const router = express.Router();

router.get('/view/api', auth, viewAllTodos);

router.get('/', auth, getAllToDos);
router.post('/', auth, restrictTo('user', 'admin'), saveToDo);
router.get('/:id', auth, getToDoByID);
router.patch('/:id', auth, restrictTo('user', 'admin'), updateToDO);
router.delete('/:id', auth, restrictTo('user', 'admin'), deleteToDo);

module.exports = router;