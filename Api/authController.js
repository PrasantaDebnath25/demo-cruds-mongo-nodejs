import UserModel from "../Models/userModel"
import jwt from 'jsonwebtoken';
import config from '../config';
import verifyToken from "../Utils/VerifyJWTToken";

exports.fetchUser = async (req, res) => {
    // let response = await verifyToken();
    // console.log("req---", req.user)
    // http://localhost:8000/api/fetch-user?id=64524f885bb6bb7fba1fa673
    // let findUser = await UserModel.findOne({ email: 1, password: 1 })
    // console.log(findUser)
    const user = req.user
    let data = {
        status: 200,
        message: 'Fetched successfully',
        data: {
            user: user
        }
    }
    return res.status(200).send(data)

}

exports.deleteUser = async (req, res) => {
    console.log("Query---", req.query)
    console.log("user---", req.user)
    // http://localhost:8000/delete-user?id=645242602236689a298dac75
    try {
        let findUser = await UserModel.deleteOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        console.log(findUser)
        if (!findUser) {
            let data = {
                status: 400,
                message: 'User not found'
            }
            return res.status(400).send(data)
        }

        let data = {
            status: 200,
            message: 'User Deleted successfully'
        }
        return res.status(200).send(data)
    } catch (err) {
        // console.log(err)
        let resBody = {
            status: 400,
            data: findUser,
            messsage: "Error"
        }
        return res.status(400).send(resBody)
    }
}

exports.deleteAllUser = async (req, res) => {
    console.log(req.query)
    // http://localhost:8000/delete-all-user
    try {
        let findUser = await UserModel.deleteMany()
        console.log(findUser)
        let resBody = {
            status: 200,
            data: findUser,
            messsage: "Delete all user"
        }
        return res.send(resBody)

    } catch (err) {
        // console.log(err)
        let resBody = {
            status: 400,
            data: findUser,
            messsage: "Error"
        }
        return res.send(resBody)
    }
}

exports.userList = async (req, res) => {
    // http://localhost:8000/api/list
    try {
        let findAllUser = await UserModel.find() //All Columns
        // let findAllUser = await UserModel.find({},{ user: 1, password: 1  })//specific Columns
        let resBody = {
            status: 200,
            data: findAllUser,
            messsage: "All users list",
            count: findAllUser.length
        }
        return res.send(resBody)

    } catch (err) {
        // console.log(err)
        let resBody = {
            status: 400,
            data: findAllUser,
            messsage: "Error",
            count: 0
        }
        return res.send(resBody)
    }


}

exports.updateUser = async (req, res) => {
    // http://localhost:8000/api/update
    // {
    //     "id": "64524f885bb6bb7fba1fa673",
    //     "name": "Kohli Roy",
    // }
    try {
        let updatedUser = await UserModel.updateOne({ _id: req.body.id }, { name: req.body.name }) //All Columns
        // let updatedUser = await UserModel.updateMany({ }, { name: req.query.name  }) //All Users updated
        console.log(updatedUser)
        let resBody = {
            status: 200,
            data: updatedUser
        }
        return res.send(resBody)

    } catch (err) {
        console.log(err)
        let resBody = {
            status: 400,
            data: err
        }
        return res.send(resBody)
    }


}