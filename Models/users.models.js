const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        minLength: [3, 'UserName Must Be At Least 3 Charcs'],
       // maxLength: [20, 'UserName Must Be At Most 3 Charcs'],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        minLength: [3, 'FirstName Must Be At Least 3 Charcs'],
        maxLength: [15, 'FirstName Must Be At Most 15 Charcs'],
        required: true
    },
    lastName: {
        type: String,
        minLength: [3, 'LastName Must Be At Least 3 Charcs'],
        maxLength: [15, 'LastName Must Be At Most 15 Charcs'],
        required: true
    },
      dob: {
    type: Date
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshToken: {
    type: String
  }
}, {
    timestamps: true 
});

userSchema.pre('save', async function (){
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;
})


const usersModel = mongoose.model('users',userSchema);


module.exports = usersModel;