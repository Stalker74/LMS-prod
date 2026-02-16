import { ICourseData, ICourseDataSchema } from "./types/apifn.types";

export const CourseContent:ICourseDataSchema = {
    sectionName:'',
    data:[
        {
            name:'',
            description:'',
            link:[
                {
                    title:'',
                    url:''
                }
            ],
            url:'',
            suggestion:[''],
            questions:[
                {
                    user:{},
                    question:'',
                    answer:[{}],
                    createdAt:new Date()
                }
            ],
            videoLength:0
        }
    ]
}

export const CourseData:ICourseData = {
    _id:'',
    name:'',
    description:'',
    price:0,
    estimatedPrice:0,
    thumbnail:{
        public_id:'',
        url:''
    },
    tags:[''],
    level:'',
    demoUrl:'',
    benefits:[''],
    preRequisits:[''],
    purchased:0,
    reviews:[
        {
            user:{},
            comment:'',
            rating:0,
            createdAt: new Date(),
            reviewReplies:[{}]
        }
    ],
    courseData:[CourseContent],
    ratings:0,
    createdAt: new Date(),
    category:''
}
