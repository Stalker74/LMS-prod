import mongoose, { Schema } from 'mongoose'


export interface INotification extends Document {
    userId:string,
    title:string,
    message:string,
    status:string
}

const notificationSchema = new Schema<INotification>({
    userId:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"unread"
    }
},{
    timestamps:true
})

export const NotificationModel = mongoose.model('Notification',notificationSchema)