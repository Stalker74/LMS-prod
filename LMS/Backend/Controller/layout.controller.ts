import { AsyncWrapper } from "../MiddleWare/AsyncWrapper.js";
import cloudinary from "cloudinary";
import { LayoutModel } from "../Model/layout.model.js";
import { customError } from "../Utils/customError.js";

export const Create_Layout = AsyncWrapper(async (req, res, next) => {
  const { type } = req.body;
  const isTypeAlreadyCreated = await LayoutModel.findOne({ type });
  if (isTypeAlreadyCreated) {
    return next(customError(400, `Layout of type "${type}" already exist`));
  }
  let data;
  if (type === "banner") {
    const { image, title, subtitle } = req.body?.banner;
    const MyCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "Layout",
    });
    const BannerImage = {
      image: {
        public_id: MyCloud.public_id,
        url: MyCloud.secure_url,
      },
      title,
      subtitle,
    };
    data = await LayoutModel.create({ type: "banner", banner: BannerImage });
  }
  if (type === "faq") {
    const { faq } = req.body;
    data = await LayoutModel.create({ type: "faq", faq });
  }
  if (type === "category") {
    const { category } = req.body;
    data = await LayoutModel.create({ type: "category", category });
  }
  return res.status(200).json({
    success: true,
    message: "Layout Created Successfully",
    data,
  });
});

export const Update_Layout = AsyncWrapper(async (req, res, next) => {
  const { type } = req.body;
  let data;
  if (type === "banner") {
    const imageData = await LayoutModel.findOne({ type: "banner" });
    const image = req.body?.banner?.image;
    const title = req.body?.banner?.title;
    const subtitle = req.body?.banner?.subtitle;
    let updatedBannerData: Partial<{
      "banner.image": object;
      "banner.title": string;
      "banner.subtitle": string;
    
    }> = {};
    if (image && imageData?.banner?.image?.public_id) {
        console.log('hi')
      await cloudinary.v2.uploader.destroy(
        imageData?.banner?.image?.public_id as string
      );
      const MyCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "Layout",
      });

      updatedBannerData['banner.image'] = {
        public_id: MyCloud?.public_id,
        url: MyCloud?.secure_url,
      };
    }
    if (title) {
      updatedBannerData['banner.title'] = title;
    }
    if (subtitle) {
      updatedBannerData['banner.subtitle'] = subtitle;
    }
    console.log('updated Banner data is',updatedBannerData)
    data = await LayoutModel.findOneAndUpdate(
      { type: "banner" },
      { $set : updatedBannerData },
      { new: true, runValidators: true }
    );
  }
  if (type === "category") {
    const category = req.body?.category;
    data = await LayoutModel.findOneAndUpdate(
      { type: "category" },
      {
        $set: {
          category: category,
        },
      },
      { new: true, runValidators: true }
    );
  }
  if (type === "faq") {
    const faq = req.body?.faq;
    data = await LayoutModel.findOneAndUpdate(
      { type: "faq" },
      {
        $set: {
          faq: faq,
        },
      },
      { new: true, runValidators: true }
    );
  }
  return res.status(201).json({
    success:true,
    message:'Layout Updated successfully',
    data:data
  })
});

export const Get_LayoutBy_Type = AsyncWrapper(async(req,res,next)=>{
    const {type} = req.body
    const Layout = await LayoutModel.findOne({type})
    if(!Layout){
        return next(customError(400,'Failed to get Layout'))
    }
    return res.status(200).json({
        success:true,
        data:Layout
    })
})
