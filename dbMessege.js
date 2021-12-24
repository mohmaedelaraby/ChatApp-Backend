import  Mongoose  from "mongoose";
const chatapp_Schema = Mongoose.Schema({
    message:String,
    name :String,
    timestamp:String,
    received:Boolean
})
export default Mongoose.model('messagecontent' ,chatapp_Schema)