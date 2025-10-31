
const todosModel = require('../Models/todos.models');
const dbConnect = require('../dbConnect');

exports.getAllToDos = async (req, res) => {
    await dbConnect();
   let todos =  await todosModel.find().populate('userId','-_id -password -__v');
   try{
    res.status(200).json({
    message: 'SUCCESS',
    data: todos
   })
   }
   catch(error)
   {
    res.status(500).json({
    message: 'There is a problem',
    error: error
   
   })
   }
    
};


exports.getToDoByID = async (req, res) => {
    await dbConnect();
    let { id } = req.params;

    try{
            let todo = await todosModel.findById(id);
            if(!todo)
            {
                res.status(404).json({ message: 'This ToDo not found' });
            }

            res.status(200).json({ message: 'Success', data: todo });

    }
    catch(error){
        res.status(400).json({
    message: 'fail',
    error: error
   });
    }

};


exports.saveToDo = async (req, res, next) => {
    const todo = req.body;
    try{
    await dbConnect();
    todo.userId = req.id;
    let newToDO = await todosModel.create(todo);

     res.status(200).json({
    message: 'SUCCESS',
    data: newToDO
   })
    }
    catch(error)
    {
        res.status(400).json({
            message: 'there is error',
            error: error
        });
    }

};


exports.updateToDO = async(req, res, next) => {
    await dbConnect();
    let {id} = req.params;
    let updatedToDO = req.body;
    try {
      let newToDo = await todosModel.findByIdAndUpdate(id, {$set: updatedToDO},{new: true});
     if (!newToDo) return res.status(404).json({ message: 'Todo is Not Found' });
        res.status(200).json({ message: 'Success', data: newToDo });


    }
    catch(error)
    {
        res.status(400).json({ message: 'fail', error: error});

    }

};


exports.deleteToDo = async (req, res, next) => {
    await dbConnect();
    const {id} = req.params;
    let todo = await todosModel.findByIdAndDelete(id);
    try{
           if(!todo)
    {
    return res.status(404).json({ message: 'Todo is Not Found' });

    }
    res.status(204).json();
    }
    catch(error)
    {
        res.status(500).json({ message: 'Error' });
    }
    

    

};


exports.viewAllTodos = async(req, res, next) => {
    await dbConnect();
   try {
    
        const todos = await todosModel.find({}).populate('userId', 'firstName lastName username')
        

        
        res.render('todos', {
            title: 'Todos Dashboard',
            todos: todos
        });
        
    } catch (error) {
        console.log( error);
        res.render('todos', {
            title: 'Todos Dashboard - Error',
            todos: []
           
        });
    }
}

