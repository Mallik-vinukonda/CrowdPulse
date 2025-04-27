const Insight = require('../models/Insight');

exports.getStats = async (req, res, next) => {
  try {
    const totalInsights = await Insight.countDocuments({ user: req.user.id });
    const recentInsights = await Insight.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(5);
    const progressAvg = await Insight.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, avgProgress: { $avg: '$progress' } } }
    ]);
    res.json({
      totalInsights,
      recentInsights,
      avgProgress: progressAvg[0]?.avgProgress || 0
    });
  } catch (err) {
    next(err);
  }
};
