import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    name:string,
    email:string,
    password:string,
    avatar:{
        public_id:string,
        url:string
    },
    role:string,
    isVerified:boolean,
    courses:string[]
}

const userSchema:Schema<IUser> = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'User name is required']
    },
    email:{
        type:String,
        required:[true,'User email is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    avatar:{
        public_id : String,
        url:String
    },
    role:{
        type:String,
        default:'user'
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    courses:[String]

},{
    timestamps:true
})

export const userModel:Model<IUser> = mongoose.model<IUser>('User',userSchema)