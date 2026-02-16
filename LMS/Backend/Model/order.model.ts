import mongoose, { Document, Schema } from "mongoose";


export interface IorderSchema extends Document {
    courseId:string,
    userId:string,
    payment_info:object
}

const orderSchema = new Schema<IorderSchema>({
    courseId:{
        type:String,
        required:true,
        ref:'Course'
    },
    userId:{
        type:String,
        required:true,
        ref:'User'
    },
    payment_info:{
        type:Object,
        
    }
},{
    timestamps:true
})

export const OrderModel = mongoose.model('Order',orderSchema)