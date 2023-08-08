import mongoose from 'mongoose';

const user = new mongoose.Schema({ //Schema variable user
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

}, {
    timestamps: true,
    versionKey: false
});


const UserModel = mongoose.model('User', user); //Collectionanasme -> 'User'

// module.exports = UserModel; //ModelName for previous version
export default UserModel;