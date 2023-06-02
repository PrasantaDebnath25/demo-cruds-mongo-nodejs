import UserModel from "../Models/userModel"
import UnAuthController from "../Api/unAuthController"
import jwt from 'jsonwebtoken';


export default function UnAuthRoute(app) {


    //UnAuthController
    app.post('/register', UnAuthController.register);
    app.post('/login', UnAuthController.login);

}