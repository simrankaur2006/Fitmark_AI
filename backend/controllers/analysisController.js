const mongoose = require('mongoose');
const Analysis = require('../models/Analysis');
const { extractResumeText } = require('../services/resumeParser');
const { analyzeResumeWithAI } = require('../services/aiService');

/**
 * POST /api/analysis
 * multipart/form-data: resume (file), jobDescription (text), jobTitle (text, optional), clientId (text, optional)
 */
async function createAnalysis(req, res, next) {
  try {
    const { jobDescription = '', jobTitle = '', clientId = '' } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file.' });
    }
    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({
        success: false,
        message: 'Please paste a job description (at least a few sentences).',
      });
    }

    const { text: resumeText, wordCount } = await extractResumeText(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    const aiResult = await analyzeResumeWithAI({ resumeText, jobDescription });

    const doc = {
      clientId: clientId || undefined,
      resumeFileName: req.file.originalname,
      jobTitle: jobTitle.trim(),
      jobDescriptionSnippet: jobDescription.trim().slice(0, 400),
      ...aiResult,
    };

    let saved = null;
    if (mongoose.connection.readyState === 1) {
      saved = await Analysis.create(doc);
    }

    return res.status(201).json({
      success: true,
      data: saved ? saved.toObject() : { ...doc, _id: null, createdAt: new Date() },
      meta: { resumeWordCount: wordCount, persisted: Boolean(saved) },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/analysis?clientId=xxx
 */
async function listAnalyses(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: [], meta: { persisted: false } });
    }
    const { clientId } = req.query;
    const filter = clientId ? { clientId } : {};
    const items = await Analysis.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/analysis/:id
 */
async function getAnalysis(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: 'History storage unavailable.' });
    }
    const item = await Analysis.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Analysis not found.' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/analysis/:id
 */
async function deleteAnalysis(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: 'History storage unavailable.' });
    }
    await Analysis.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Analysis deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createAnalysis, listAnalyses, getAnalysis, deleteAnalysis };
