const express = require('express');
const router = express.Router();
const {
    saveResume,
    getMyResume,
    getResumeById,
    downloadResume,
    deleteResume
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.post('/', protect, saveResume);
router.get('/', protect, getMyResume);
router.get('/download/:id', downloadResume);
router.get('/:id', protect, getResumeById);
router.delete('/', protect, deleteResume);

module.exports = router;
