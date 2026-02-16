import mongoose, { Document, Schema } from "mongoose";

interface IFAQItem extends Document {
    question : string ,
    answer : string
}

interface ICategory extends Document {
    category : string
}
interface IBannerImage extends Document {
    public_id : string,
    url: string
}

interface ILayout extends Document {
    type: string,
    category : ICategory[],
    faq : IFAQItem[],
    banner : {
        image : IBannerImage,
        title : string,
        subtitle: string
    }
}

const LayoutSchema = new Schema<ILayout>(
    {
        type:{
            type:String
        },
        faq:[
            {
                question:{
                    type:String
                },
                answer:{
                    type:String
                }
            }
        ],
        category:[
            {
                title:{
                    type:String
                }
            }
        ],
        banner:{
            image:{
                public_id:{
                    type:String
                },
                url:{
                    type:String
                }
            },
            title:{
                type:String
            },
            subtitle:{
                type:String
            }
        }
    }
)

export const LayoutModel = mongoose.model('Layout',LayoutSchema)
