const uri = "mongodb+srv://prasanta-te:prasanta@cluster0.txhljuf.mongodb.net/?retryWrites=true&w=majority"
// "mongodb://localhost:27017/newDb";
const express = require('express');
const helmet = require('helmet')
const mongoose = require('mongoose')
const cors = require('cors')
const UserModel = require('./userModel')
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

app.post('/register', async (req, res)=> {
    console.log(req.body)
    // http://localhost:8000/register
    // {
    //     "name":"Pro",
    //     "pass":"Pro@1"
    // }
    await UserModel.create({user: req.body.name, password: req.body.pass})
    return res.send('Added')
})

app.get('/login', async (req, res)=> {
    console.log(req.query)
    // http://localhost:8000/login?name=Pro&pass=Pro@1
    await UserModel.create({user: req.query.name, password: req.query.pass})
    return res.send('Added')
})

app.get('/fetch-user', async (req, res)=> {
    console.log(req.query)
    // http://localhost:8000/fetch-user?id=64524f885bb6bb7fba1fa673
    let findUser = await UserModel.findOne({_id: req.query.id }, { user: 1, password: 1  })
    console.log(findUser)
    return res.send(findUser)
})

app.get('/delete-user', async (req, res)=> {
    console.log(req.query)
    // http://localhost:8000/delete-user?id=645242602236689a298dac75
    try{
        let findUser = await UserModel.deleteOne({_id: mongoose.Types.ObjectId(req.query.id) })
        console.log(findUser)
        if(findUser?.deletedCount >0){
            return res.send("User Deleted successfully for user id "+ findUser)
        }else{
            return res.send("User Not found")
        }

        
    }catch(err){
        // console.log(err)
        return res.send("Err")
    }
    
    
})

app.delete('/delete-all-user', async (req, res)=> {
    console.log(req.query)
    // http://localhost:8000/delete-user?id=645242602236689a298dac75
    try{
        let findUser = await UserModel.deleteMany()
        console.log(findUser)
        let resBody = {
            status: 200,
            data: findUser
        }
        return res.send(resBody)
        
    }catch(err){
        // console.log(err)
        return res.send("Err")
    }
    
    
})

app.get('/list', async (req, res)=> {
    // http://localhost:8000/list
    try{
        let findAllUser = await UserModel.find() //All Columns
        // let findAllUser = await UserModel.find({},{ user: 1, password: 1  })//specific Columns
        console.log(findAllUser)
        return res.send("All users are "+ findAllUser)
        
    }catch(err){
        // console.log(err)
        return res.send("Err")
    }
    
    
})

app.get('/update', async (req, res)=> {
    // http://localhost:8000/update?id=645256a4d642e249c147d88a&name=Pros
    try{
        let updatedUser = await UserModel.updateOne({_id: req.query.id }, { user: req.query.name  }) //All Columns
        // let updatedUser = await UserModel.updateMany({ }, { user: req.query.name  }) //All Users updated
        console.log(updatedUser)
        let resBody = {
            status: 200,
            data: updatedUser
        }
        return res.send(resBody)
        
    }catch(err){
        console.log(err)
        let resBody = {
            status: 400,
            data: err
        }
        return res.send(resBody)
    }
    
    
})

app.listen(8000, ()=> {
    console.log('Server listen-----')
})


