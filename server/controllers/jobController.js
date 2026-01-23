const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs with search & filter
// @route   GET /api/jobs
exports.getJobs = async (req, res) => {
    try {
        const { search, location, type, experience, page = 1, limit = 10 } = req.query;

        let query = { isActive: true };

        // Search by title, company, or skills
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Filter by location
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Filter by job type
        if (type) {
            query.type = type;
        }

        // Filter by experience
        if (experience) {
            query['experience.min'] = { $lte: parseInt(experience) };
        }

        const jobs = await Job.find(query)
            .populate('postedBy', 'name company')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Job.countDocuments(query);

        res.json({
            jobs,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
exports.getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name company companyDescription');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create job
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
    try {
        const jobData = {
            ...req.body,
            postedBy: req.user.id,
            company: req.user.company
        };

        const job = await Job.create(jobData);
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Make sure user owns the job
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this job' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Make sure user owns the job
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/my-jobs
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id })
            .sort({ createdAt: -1 });

        // Get application count for each job
        const jobsWithApplicants = await Promise.all(
            jobs.map(async (job) => {
                const applicantCount = await Application.countDocuments({ job: job._id });
                return { ...job.toObject(), applicantCount };
            })
        );

        res.json(jobsWithApplicants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
