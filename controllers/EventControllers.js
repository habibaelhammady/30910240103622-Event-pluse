const Event = require('../models/Event');
const mongoose = require('mongoose');

const getEvents = async (req, res) => {
  try {
    const { category, city, startDate, endDate, search, sort, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const matchStage = {};

    if (category) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    }

    if (city) {
      matchStage.city = { $regex: city, $options: 'i' };
    }

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pipeline = [
      { $match: matchStage },
    
      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: 'event',
          as: 'registrations'
        }
      },
      {
        $addFields: {
          registrationCount: { $size: '$registrations' }
        }
      }
    ];

    let sortStage = { date: 1 };

    if (sort === '-date') {
      sortStage = { date: -1 };
    } else if (sort === 'popularity' || sort === '-popularity') {
      sortStage = { registrationCount: -1 }; 
    }

    pipeline.push({ $sort: sortStage });


    pipeline.push({
      $facet: {
        metadata: [{ $count: 'total' }],
        events: [
          { $skip: skip },
          { $limit: limitNum },
          {
            $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'category'
            }
          },
          { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
          { $project: { registrations: 0 } } 
        ]
      }
    });

    const result = await Event.aggregate(pipeline);

    const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
    const events = result[0].events || [];


    return res.status(200).json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      events
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getEvents };