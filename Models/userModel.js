import mongoose from 'mongoose';

const user = new mongoose.Schema({ //Schema Var
    email: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    status: {
        type: String,
        default: "A"
    },
    
},{
    timestamps: true,
    versionKey: false
});


const UserModel = mongoose.model('User', user); //Collectionanasme -> 'User'

// module.exports = UserModel; //ModelName
export default UserModel;