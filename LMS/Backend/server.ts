import { app } from "./app.js";
import dotenv from "dotenv";
import { ConnectDB } from "./Database/connection.js";
import {v2 as cloudinary} from 'cloudinary'
import { socketServer } from "./socketio.js";
dotenv.config();
cloudinary.config({
   cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
   api_key:process.env.CLOUDINARY_API_KEY,
   api_secret:process.env.CLOUDINARY_API_SECRETS
})



ConnectDB()
.then(() => {
  socketServer.listen(process.env.PORT, () => {
    console.log("Server is running on Port", process.env.PORT);
  });
})
.catch((error)=>{
    console.log('Something went wrong',error)
})
