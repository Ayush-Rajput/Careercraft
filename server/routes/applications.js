const express = require('express');
const router = express.Router();
const {
    applyToJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
    toggleSaveJob,
    getSavedJobs
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/:jobId', protect, authorize('jobseeker'), applyToJob);
router.get('/my-applications', protect, authorize('jobseeker'), getMyApplications);
router.get('/saved', protect, authorize('jobseeker'), getSavedJobs);
router.post('/save/:jobId', protect, authorize('jobseeker'), toggleSaveJob);
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplicants);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
