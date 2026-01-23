const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a job title'],
        trim: true,
        maxlength: 100
    },
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Please provide job location'],
        trim: true
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
        default: 'Full-time'
    },
    salary: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: 'INR' }
    },
    experience: {
        min: { type: Number, default: 0 },
        max: { type: Number }
    },
    description: {
        type: String,
        required: [true, 'Please provide job description']
    },
    requirements: [{
        type: String
    }],
    skills: [{
        type: String
    }],
    benefits: [{
        type: String
    }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    deadline: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for search
jobSchema.index({ title: 'text', company: 'text', location: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
