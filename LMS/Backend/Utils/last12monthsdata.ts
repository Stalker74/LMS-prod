import { Model } from "mongoose";

interface DataFormat {
  month: string;
  count: number;
}

export const last12MothsData = async <T>(
  model: Model<T>
): Promise<DataFormat[]> => {
  try {
    const startingDate = new Date();
    startingDate.setMonth(startingDate.getMonth() - 11);
    startingDate.setDate(1);
    startingDate.setHours(0, 0, 0, 0);
    const data = await model.aggregate([
      {
        $match: {
          createdAt: { $gte: startingDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
    const monthData : DataFormat[] = []
    for(let i=11; i>=0; i--){
        const now = new Date()
        now.setMonth(now.getMonth() - i)
        const year = now.getFullYear()
        const month = now.getMonth() + 1
        const found = data.length > 0 && data.find(d=>d._id.year === year && d._id.month === month)
        monthData.push({
            month:now.toLocaleString("default",{year:'numeric',month:'short'}),
            count: found ? found?.count : 0
        })



        
    }
    return monthData

  } catch(error) {
    console.log("Failed to calculate last 12 months data", error);
    return []
  }
};
