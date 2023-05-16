const uri = "mongodb+srv://prasanta-te:prasanta@cluster0.txhljuf.mongodb.net/?retryWrites=true&w=majority"
// "mongodb://localhost:27017/newDb";
import express from 'express';
import helmet from 'helmet'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'jsonwebtoken';
import UserModel from './Models/userModel'
import SubscriptionModel from './Models/subscriptionModel'
import config from './config';
import verifyToken from './Utils/VerifyJWTToken';

const app = express()

app.use(cors())
app.use(express.json())
app.use(helmet()); //X-Powered-By: Express

mongoose.connect(uri, {
    useNewUrlParser: true,
    // useUnifiedTopology: true
})

mongoose.Promise = global.Promise;

const dbCon = mongoose.connection;

dbCon.on('error', console.error.bind(console, 'MongoDB connection error:'));
dbCon.once('open', () => {
    console.log("Database connected");
});

app.post('/register', async (req, res) => {
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
})

app.post('/login', async (req, res) => {
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
    console.log("token---", token)

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    res.status(200).send({
        status: 200,
        message: 'Logged in successfully',
        data: {
            _id: user._id,
            accessToken: token,
            email: user.email,
            user: user
        }
    });
    // return res.send('Added')
})

app.get('/fetch-user', verifyToken, async (req, res) => {
    // let response = await verifyToken();
    // console.log(req)
    // http://localhost:8000/fetch-user?id=64524f885bb6bb7fba1fa673
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

})

app.get('/delete-user', verifyToken, async (req, res) => {
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


})

app.delete('/delete-all-user', async (req, res) => {
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


})

app.get('/list', async (req, res) => {
    // http://localhost:8000/list
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


})

app.post('/update', async (req, res) => {
    // http://localhost:8000/update
    // {
    //     "id": "6456995280e2e92727ae1dac",
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


})

// ===========================Subscription===========================================
app.post('/subscription-create', verifyToken, async (req, res) => {
    console.log(req.body)
    // http://localhost:8000/subscription-create
    // {
    //     "subscriptionName":"Subs 1",
    // }
    const LoggedInUser = req.user
    let users = await SubscriptionModel.create({ userId: LoggedInUser._id, subscriptionName: req.body.subscriptionName, status: req.body.status })
    let resBody = {
        status: 200,
        data: users,
        messsage: "Subscription created successfully"
    }
    return res.status(200).send(resBody)
})

app.get('/get-subs', verifyToken, async (req, res) => {
    // http://localhost:8000/get-subs?id=6456995280e2e92727ae1dac
    let getSubs = await SubscriptionModel.aggregate([
        {
            $lookup:
            {
                from: "User",
                localField: "userId",
                foreignField: "_id",
                as: "UserModels"
            }
        },
        {
            $unwind: { path: "$UserModels", "preserveNullAndEmptyArrays": true }
        },
        {
            $match: { userId: req.query.id, status: "A" }
        },
        {
            $project: { "subscriptionName": 1, "name": "$UserModels.name" }
        }
    ])

    let resBody = {
        status: 200,
        data: getSubs,
        messsage: "Subscription fetched successfully"
    }
    return res.status(200).send(resBody)
})


app.listen(8000, () => {
    console.log('Server listen-----')
})


