const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: [3, 'Todo must be at least 3 characters'],
        maxLength: [20, 'Todo must be at most 20 characters'],
        required: true
    },
    description: {
        type: String,
        minLength: [5, 'Description must be at least 5 characters'],
        maxLength: [100, 'Description must be at most 100 characters'],
        required: true
    },  
    status: {
        type: String,
        enum: ['to-do', 'in progress', 'done'],
        default: 'to-do'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'users',
        required: true
    }
}, {
    timestamps: true 
});

const todosModel = mongoose.model('todos', todoSchema);

module.exports = todosModel;
