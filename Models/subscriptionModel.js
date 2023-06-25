import mongoose from 'mongoose';

const subscription = new mongoose.Schema({ //Schema Var
    userId: {
        type: String
    },
    subscriptionName: {
        type: String
    },
    status: {
        type: String,
        default: "A"
    },
    
},{
    timestamps: true,
    versionKey: false
});


const SubscriptionModel = mongoose.model('Subscription', subscription);  //Collectionanasme -> 'Subscription'

export default SubscriptionModel;