const LearningPath = require('../models/LearningPath');
const UserLearningProgress = require('../models/UserLearningProgress');
const User = require('../models/User');

// GET /api/learning-paths
exports.getLearningPaths = async (req, res, next) => {
  try {
    const { subject, grade } = req.query;
    const query = { isActive: true };
    if (subject) query.subject = subject;
    if (grade) query.grade = grade;

    const paths = await LearningPath.find(query);

    const pathsWithProgress = await Promise.all(
      paths.map(async (path) => {
        const progress = await UserLearningProgress.findOne({
          user: req.user.id,
          learningPath: path._id,
        });

        const totalNodes = path.nodes.length;
        const completedNodes = progress ? progress.completedNodes.length : 0;

        return {
          id: path._id,
          title: path.title,
          description: path.description,
          subject: path.subject,
          grade: path.grade,
          nodes: path.nodes,
          totalNodes,
          completedNodes,
          progress: totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0,
        };
      })
    );

    res.status(200).json({ success: true, data: pathsWithProgress });
  } catch (error) {
    next(error);
  }
};

// GET /api/learning-paths/:id
exports.getLearningPath = async (req, res, next) => {
  try {
    const path = await LearningPath.findById(req.params.id);
    if (!path) {
      return res.status(404).json({
        success: false,
        message: 'Learning path không tồn tại',
      });
    }

    const progress = await UserLearningProgress.findOne({
      user: req.user.id,
      learningPath: path._id,
    });

    const completedNodes = progress ? progress.completedNodes : [];

    const nodesWithStatus = path.nodes.map((node) => {
      let status = 'locked';
      if (completedNodes.includes(node.id)) {
        status = 'completed';
      } else {
        const requirementsMet = (node.requirements || []).every((reqId) =>
          completedNodes.includes(reqId)
        );
        if (!node.requirements || node.requirements.length === 0 || requirementsMet) {
          status = 'unlocked';
        }
      }
      return {
        ...node.toObject(),
        status,
        completedAt:
          status === 'completed' && progress ? progress.lastAccessedAt : null,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        id: path._id,
        title: path.title,
        description: path.description,
        subject: path.subject,
        grade: path.grade,
        nodes: nodesWithStatus,
        totalNodes: path.nodes.length,
        completedNodes: completedNodes.length,
        progress:
          path.nodes.length > 0
            ? Math.round((completedNodes.length / path.nodes.length) * 100)
            : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/learning-paths/me/progress
exports.getMyProgress = async (req, res, next) => {
  try {
    const { pathId } = req.query;
    const query = { user: req.user.id };
    if (pathId) query.learningPath = pathId;

    const progress = await UserLearningProgress.findOne(query).populate('learningPath');

    if (!progress) {
      return res.status(200).json({
        success: true,
        data: {
          learningPath: pathId || null,
          completedNodes: [],
          currentNode: null,
          lastAccessedAt: null,
          totalXP: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        learningPath: progress.learningPath._id,
        completedNodes: progress.completedNodes,
        currentNode: progress.currentNode,
        lastAccessedAt: progress.lastAccessedAt,
        totalXP: progress.totalXP,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/learning-paths/:id/nodes/:nodeId/complete
exports.completeNode = async (req, res, next) => {
  try {
    const { id: pathId, nodeId } = req.params;

    const path = await LearningPath.findById(pathId);
    if (!path) {
      return res.status(404).json({
        success: false,
        message: 'Learning path không tồn tại',
      });
    }

    const node = path.nodes.find((n) => n.id === nodeId);
    if (!node) {
      return res.status(404).json({
        success: false,
        message: 'Node không tồn tại',
      });
    }

    let progress = await UserLearningProgress.findOne({
      user: req.user.id,
      learningPath: pathId,
    });

    if (!progress) {
      progress = await UserLearningProgress.create({
        user: req.user.id,
        learningPath: pathId,
        completedNodes: [],
        totalXP: 0,
      });
    }

    if (progress.completedNodes.includes(nodeId)) {
      return res.status(400).json({
        success: false,
        message: 'Node đã được hoàn thành rồi',
      });
    }

    progress.completedNodes.push(nodeId);
    progress.currentNode = nodeId;
    progress.lastAccessedAt = new Date();
    const xpToAdd = node.rewards?.xp || 0;
    progress.totalXP += xpToAdd;
    await progress.save();

    if (xpToAdd > 0) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { xp: xpToAdd } });
    }

    const unlockedNodes = path.nodes
      .filter((n) => {
        if (progress.completedNodes.includes(n.id)) return false;
        const requirementsMet = (n.requirements || []).every((reqId) =>
          progress.completedNodes.includes(reqId)
        );
        return !n.requirements || n.requirements.length === 0 || requirementsMet;
      })
      .map((n) => n.id);

    res.status(200).json({
      success: true,
      data: {
        progress: {
          learningPath: progress.learningPath,
          completedNodes: progress.completedNodes,
          currentNode: progress.currentNode,
          lastAccessedAt: progress.lastAccessedAt,
          totalXP: progress.totalXP,
        },
        xpEarned: xpToAdd,
        unlockedNodes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/learning-paths/:id/next-suggested
exports.getNextSuggestedNode = async (req, res, next) => {
  try {
    const path = await LearningPath.findById(req.params.id);
    if (!path) {
      return res.status(404).json({
        success: false,
        message: 'Learning path không tồn tại',
      });
    }

    const progress = await UserLearningProgress.findOne({
      user: req.user.id,
      learningPath: path._id,
    });

    const completedNodes = progress ? progress.completedNodes : [];

    const suggestedNode = path.nodes.find((node) => {
      if (completedNodes.includes(node.id)) return false;
      const requirementsMet = (node.requirements || []).every((reqId) =>
        completedNodes.includes(reqId)
      );
      return !node.requirements || node.requirements.length === 0 || requirementsMet;
    });

    res.status(200).json({
      success: true,
      data: suggestedNode || null,
    });
  } catch (error) {
    next(error);
  }
};


