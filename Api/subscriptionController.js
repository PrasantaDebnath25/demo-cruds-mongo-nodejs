import UserModel from "../Models/userModel"
import jwt from 'jsonwebtoken';
import SubscriptionModel from "../Models/subscriptionModel";

exports.createSubscription = async (req, res) => {
    console.log(req.body)
    // http://localhost:8000/api/subscription-create
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

// logged in User Subscription list
exports.getSubscription = async (req, res) => {
    // http://localhost:8000/api/get-subscription
    const LoggedInUser = req.user
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
            $match: { userId: LoggedInUser._id, status: "A" }
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