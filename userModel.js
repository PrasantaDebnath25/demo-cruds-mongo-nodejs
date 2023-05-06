const mongoose = require('mongoose');

const user = new mongoose.Schema({ //Schema Var
    user: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    
},{
    timestamps: true,
    versionKey: false
});


const UserModel = mongoose.model('User', user); //Collectionanasme -> 'User'

module.exports = UserModel; //ModelName