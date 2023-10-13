const mongoose = require('mongoose');

// definition of schema
const userSchema = new mongoose.Schema({
    name : {
      type : String,
       required : true
     },
    login : {
              type : String,
              required : true,
              unique : true
            },
    password : {
                type : String,
                required : true
               },
               ItemsEmprunté: {
                 type: [{
                   type: mongoose.ObjectId,
                   ref: 'Item'
                 }],
                 validate: [arrayLimit, 'array exceeds the limit of 2']
               }
             });

             function arrayLimit(val) {
               return val.length <= 2;
             }

module.exports = userSchema;

// model
const dbConnection = require('../controllers/db.controller');
const User = dbConnection.model('User',userSchema,'users');

module.exports.model = User;
