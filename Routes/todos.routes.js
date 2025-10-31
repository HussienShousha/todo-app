const express = require('express');
const {getAllToDos, getToDoByID, saveToDo, updateToDO, deleteToDo, viewAllTodos} = require('../Controllers/todos.controller');

const {auth, restrictTo} = require('../Middleware/auth');


const router = express.Router();





router.get('/', auth ,getAllToDos);




router.get('/:id', auth ,getToDoByID);






router.patch('/:id', auth ,restrictTo('user', 'admin') ,updateToDO);



router.post('/', auth ,restrictTo('user' ,'admin') ,saveToDo);




router.delete('/:id', auth ,restrictTo('user') ,deleteToDo);

router.get('/view/api', viewAllTodos);


module.exports = router;


