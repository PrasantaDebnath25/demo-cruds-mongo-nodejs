import UserModel from "../Models/userModel"
import jwt from 'jsonwebtoken';
import AuthController from "../Api/authController"
import verifyToken from "../Utils/VerifyJWTToken";
import express from 'express';
// const api_router = express.Router();
const auth_api_router = express.Router();

auth_api_router.use(verifyToken);

export default function AuthRoute(app) {
    
    /*--------------- uthorised Routes Start Here -------------------------*/
    app.use('/api', auth_api_router);

    // app.use(verifyToken);

    //Auth Controller
    auth_api_router.get('/fetch-user', AuthController.fetchUser);
    auth_api_router.get('/delete-user', AuthController.deleteUser);
    auth_api_router.delete('/delete-all-user', AuthController.deleteAllUser);
    auth_api_router.get('/user-list', AuthController.userList);
    auth_api_router.post('/update', AuthController.updateUser);
    
}