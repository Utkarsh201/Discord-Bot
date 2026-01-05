import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
    _id : String,
    createdAt:{
        type :  Date,
        default : Date.now,
        expires : 86400      
    }
})

export const Log = mongoose.model("Log", LogSchema);