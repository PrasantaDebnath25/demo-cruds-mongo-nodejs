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

exports.getSubscription = async (req, res) => {
    // http://localhost:8000/get-subs?id=64524f885bb6bb7fba1fa673
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
}