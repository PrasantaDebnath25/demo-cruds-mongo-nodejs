import UserModel from "../Models/userModel"
import UnAuthController from "../Api/unAuthController"
import jwt from 'jsonwebtoken';


export default function UnAuthRoute(app) {

    /*--------------- Unauthorised Routes Start Here -------------------------*/
    // app.use('/api', api_router);


    //UnAuthController
    app.post('/register', UnAuthController.register);
    app.post('/login', UnAuthController.login);

}