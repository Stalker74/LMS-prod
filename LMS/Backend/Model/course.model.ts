import mongoose, { Date, Document, Schema } from "mongoose";

export interface ICourseDataSchema extends Document {
    sectionName:string,
    data:{

        name:string,
        description:string,
        // video:{
        //     thumbnail:{
        //         public_id:string,
        //         url:string
        //     },
        //     url:string,
        //     section:string,
        //     length:string,
    
        // },
        link:[
            {
                title:string,
                url:string
            }
        ],
        url:string,
        suggestion:string[],
        questions:[
            {
                user:object,
                question:string,
                answer:object[],
                createdAt: Date
    
            }
        ],
        videoLength:number
    }[]

}
const CourseDataSchema = new Schema<ICourseDataSchema>({
    sectionName:{
        type:String,
        required:true
    },
    data:[
        {

            name:{
                type:String,
                required:true
            },
            description:{
                type:String,
                required:true
            },
            // video:{
            //     thumbnail:{
            //         public_id:{
            //             type:String
            //         },
            //         url:{
            //             type:String
            //         }
            //     },
            //     url:{
            //         type:String
            //     },
            //     section:{
            //         type:String
            //     },
            //     length:{
            //         type:Number
            //     },
        
            // },
            link:[
                {
                    title:{
                        type:String
                    },
                    url:{
                        type:String
                    }
                }
            ],
            url:String,
            suggestion:[String],
            questions:[
                {
                    user:Object,
                    question:{
                        type:String
                    },
                    answer:Array,
                    createdAt: {
                        type: Date,
                        default : Date.now
                    }
        
                }
            ],
            videoLength:String
        }
    ]
    

})

export interface ICourseSchema extends Document {
    name:string,
    description:string,
    price:number,
    estimatedPrice:number,
    thumbnail:{
        public_id:string,
        url:string
    },
    tags:string[],
    level:string,
    category:string,
    demoUrl:string,
    benefits:string[],
    preRequisits:string[],
    purchased:number,
    reviews:[
        {
            user:object,
            comment:string,
            rating:number,
            createdAt?: Date,
            reviewReplies:object[]
        }
    ],
    courseData:ICourseDataSchema[],
    ratings:number


}

const CourseSchema = new Schema<ICourseSchema>({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    estimatedPrice:{
        type:Number
    },
    thumbnail:{
        public_id:{
            type:String
        },
        url:{
            type:String
        }
    },
    tags:{
        type:[String]
    },
    level:{
        type:String
    },
    category:{
        type:String
    },
    demoUrl:{
        type:String
    },
    benefits:{
        type:[String]
    },
    preRequisits:{
        type:[String]
    },
    purchased:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:Object
            },
            comment:{
                type:String
            },
            rating:{
                type:Number
            },
            createdAt: {
                type: Date,
                default : Date.now
            }, 
            reviewReplies:Array
        }
    ],
    courseData:[
        CourseDataSchema
    ],
    ratings:{
        type:Number,
        default:0
    }


},{
    timestamps:true
})

export const CourseModel = mongoose.model<ICourseSchema>('Course',CourseSchema)

