//importing
import express from 'express'
import mongoose from 'mongoose'
import Message from './dbMessege.js'
import Pusher from 'pusher'
import cors from 'cors'

//configs
const app=express()
const port= process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1316439",
    key: "788456acb2d1d22a8ff6",
    secret: "6717c95dbae0b8e0233f",
    cluster: "eu",
    useTLS: true
  });

//middleware
app.use(express.json())
app.use(cors())

//DB Connection
const connection_url='mongodb+srv://admin:0123456789@cluster0.6bvzq.mongodb.net/ChatApp-Backend?retryWrites=true&w=majority'
mongoose.connect(connection_url)

const db = mongoose.connection
db.once('open',()=>{
    console.log("DB is connected");

    const myMsgCollection = db.collection('messagecontents');
    const changeStream =myMsgCollection.watch();

    changeStream.on('change',(change)=>{
        console.log('the change is ',change);

        if(change.operationType=="insert"){
            const msgDetials = change.fullDocument;

            pusher.trigger("messages" , "inserted" ,{
                name:msgDetials.name,
                message:msgDetials.message,
                timestamp:msgDetials.timestamp,
                received: msgDetials.received
            });
        }
        else{
            console.log("error is happend in pusher trigger")
        }


    })
})
//code



//api routes
app.get('/', (req,res)=>{
    res.status(200).send('hello world')
});

app.get('/messages/sync',(req,res)=>{
    Message.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new',(req,res)=>{
    const dbMessage=req.body

    Message.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(201).send(data)

        }
    })
})

//listner
app.listen(port,console.log(`server is running on: ${port}`))