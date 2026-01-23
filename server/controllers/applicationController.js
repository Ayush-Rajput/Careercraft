const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
exports.applyToJob = async (req, res) => {
    try {
        const { resumeId, coverLetter } = req.body;
        const jobId = req.params.jobId;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user.id,
            resume: resumeId,
            coverLetter
        });

        // Add application to job
        await Job.findByIdAndUpdate(jobId, {
            $push: { applicants: application._id }
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my applications (job seeker)
// @route   GET /api/applications/my-applications
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate({
                path: 'job',
                select: 'title company location type salary'
            })
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applicants for a job (recruiter)
// @route   GET /api/applications/job/:jobId
exports.getJobApplicants = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user owns the job
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate({
                path: 'applicant',
                select: 'name email phone location skills experience'
            })
            .populate({
                path: 'resume',
                select: 'personalInfo skills experience education'
            })
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status (recruiter)
// @route   PUT /api/applications/:id/status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if user owns the job
        if (application.job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Save/Unsave a job
// @route   POST /api/applications/save/:jobId
exports.toggleSaveJob = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const jobId = req.params.jobId;

        const isSaved = user.savedJobs.includes(jobId);

        if (isSaved) {
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
        } else {
            user.savedJobs.push(jobId);
        }

        await user.save();
        res.json({ saved: !isSaved, savedJobs: user.savedJobs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get saved jobs
// @route   GET /api/applications/saved
exports.getSavedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'savedJobs',
            populate: { path: 'postedBy', select: 'company' }
        });

        res.json(user.savedJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
