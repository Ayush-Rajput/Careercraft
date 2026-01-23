const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    template: {
        type: String,
        enum: ['modern', 'classic', 'minimal'],
        default: 'modern'
    },
    personalInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        location: { type: String },
        linkedin: { type: String },
        github: { type: String },
        portfolio: { type: String },
        summary: { type: String }
    },
    education: [{
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        field: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        grade: { type: String },
        description: { type: String }
    }],
    experience: [{
        company: { type: String, required: true },
        position: { type: String, required: true },
        location: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String },
        achievements: [{ type: String }]
    }],
    skills: [{
        name: { type: String, required: true },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            default: 'intermediate'
        }
    }],
    projects: [{
        name: { type: String, required: true },
        description: { type: String },
        technologies: [{ type: String }],
        link: { type: String },
        github: { type: String }
    }],
    certifications: [{
        name: { type: String },
        issuer: { type: String },
        date: { type: Date },
        link: { type: String }
    }],
    languages: [{
        name: { type: String },
        proficiency: { type: String }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

resumeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Resume', resumeSchema);
