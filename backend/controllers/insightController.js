const Insight = require('../models/Insight');

exports.createInsight = async (req, res, next) => {
  try {
    const { title, content, tags, category } = req.body;
    const insight = await Insight.create({
      user: req.user.id,
      title,
      content,
      tags,
      category,
    });
    res.status(201).json(insight);
  } catch (err) {
    next(err);
  }
};

exports.getInsights = async (req, res, next) => {
  try {
    const { search, tag, category } = req.query;
    let query = { user: req.user.id };
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
    if (tag) query.tags = tag;
    if (category) query.category = category;
    const insights = await Insight.find(query).sort({ createdAt: -1 });
    res.json(insights);
  } catch (err) {
    next(err);
  }
};

exports.getInsight = async (req, res, next) => {
  try {
    const insight = await Insight.findOne({ _id: req.params.id, user: req.user.id });
    if (!insight) return res.status(404).json({ message: 'Insight not found' });
    res.json(insight);
  } catch (err) {
    next(err);
  }
};

exports.updateInsight = async (req, res, next) => {
  try {
    const { title, content, tags, category, progress } = req.body;
    const insight = await Insight.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, content, tags, category, progress, updatedAt: Date.now() },
      { new: true }
    );
    if (!insight) return res.status(404).json({ message: 'Insight not found' });
    res.json(insight);
  } catch (err) {
    next(err);
  }
};

exports.deleteInsight = async (req, res, next) => {
  try {
    const insight = await Insight.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!insight) return res.status(404).json({ message: 'Insight not found' });
    res.json({ message: 'Insight deleted' });
  } catch (err) {
    next(err);
  }
};
