import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const DB_URL:string = process.env.DB_URL || ''
export const ConnectDB = async()=>{
    try {
        await mongoose.connect(DB_URL)
    } catch (error) {
        console.log('Failed to connect to Database', error)
        throw error
    }
}

