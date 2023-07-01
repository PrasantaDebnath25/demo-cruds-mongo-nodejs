import UserModel from "../Models/userModel"
import jwt from 'jsonwebtoken';
import config from '../config';

const register = async (req, res) => {
    console.log(req.body)
    // http://localhost:8000/register
    // {
    //     "email": "pro@yopmail.com",
    //     "name":"Pro",
    //     "pass":"Pro@1"
    // }
    let users = await UserModel.create({ email: req.body.email, name: req.body.name, password: req.body.pass })
    let resBody = {
        status: 200,
        data: users,
        messsage: "User created successfully"
    }
    return res.status(200).send(resBody)

}

const login = async (req, res) => {
    console.log(req.body)
    // http://localhost:8000/login
    const user = await UserModel.findOne({ $and: [{ email: req.body.email, password: req.body.pass }] })

    if (!user) {
        return res.status(200).send({
            status: 400,
            message: 'Credential mismatched',
            data: {
                _id: null,
                accessToken: null,
                email: req.body.email,
                user: ""
            }
        });
    }
    console.log("User---", user)
    const token = jwt.sign({ _id: user._id }, config.SECRET_KEY);
    console.log("Jwt token---", token)

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    return res.status(200).send({
        status: 200,
        message: 'Logged in successfully',
        data: {
            _id: user._id,
            accessToken: token,
            email: user.email,
            user: user
        }
    });
}

export default {register, login}
