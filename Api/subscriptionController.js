import UserModel from "../Models/userModel"
import jwt from 'jsonwebtoken';
import config from '../config';
import verifyToken from "../Utils/VerifyJWTToken";
import SubscriptionModel from "../Models/subscriptionModel";

exports.createSubscription = async (req, res) => {
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

}
