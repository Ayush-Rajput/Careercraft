const Resume = require('../models/Resume');
const PDFDocument = require('pdfkit');

// @desc    Create/Update resume
// @route   POST /api/resume
exports.saveResume = async (req, res) => {
    try {
        let resume = await Resume.findOne({ user: req.user.id });

        if (resume) {
            // Update existing resume
            resume = await Resume.findOneAndUpdate(
                { user: req.user.id },
                { ...req.body },
                { new: true, runValidators: true }
            );
        } else {
            // Create new resume
            resume = await Resume.create({
                user: req.user.id,
                ...req.body
            });
        }

        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my resume
// @route   GET /api/resume
exports.getMyResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user.id });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get resume by ID
// @route   GET /api/resume/:id
exports.getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Download resume as PDF
// @route   GET /api/resume/download/:id
exports.downloadResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);

        // Pipe PDF to response
        doc.pipe(res);

        // Header - Name
        doc.fontSize(24).font('Helvetica-Bold').text(resume.personalInfo.fullName, { align: 'center' });
        doc.moveDown(0.5);

        // Contact Info
        const contactParts = [];
        if (resume.personalInfo.email) contactParts.push(resume.personalInfo.email);
        if (resume.personalInfo.phone) contactParts.push(resume.personalInfo.phone);
        if (resume.personalInfo.location) contactParts.push(resume.personalInfo.location);

        doc.fontSize(10).font('Helvetica').text(contactParts.join(' | '), { align: 'center' });

        // Links
        const linkParts = [];
        if (resume.personalInfo.linkedin) linkParts.push(`LinkedIn: ${resume.personalInfo.linkedin}`);
        if (resume.personalInfo.github) linkParts.push(`GitHub: ${resume.personalInfo.github}`);
        if (resume.personalInfo.portfolio) linkParts.push(`Portfolio: ${resume.personalInfo.portfolio}`);

        if (linkParts.length > 0) {
            doc.moveDown(0.3);
            doc.fontSize(9).text(linkParts.join(' | '), { align: 'center' });
        }

        doc.moveDown();

        // Summary
        if (resume.personalInfo.summary) {
            doc.fontSize(12).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica').text(resume.personalInfo.summary);
            doc.moveDown();
        }

        // Experience
        if (resume.experience && resume.experience.length > 0) {
            doc.fontSize(12).font('Helvetica-Bold').text('EXPERIENCE');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);

            resume.experience.forEach(exp => {
                doc.fontSize(11).font('Helvetica-Bold').text(exp.position);
                doc.fontSize(10).font('Helvetica').text(`${exp.company}${exp.location ? ` - ${exp.location}` : ''}`);

                const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
                const endDate = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
                doc.fontSize(9).fillColor('#666666').text(`${startDate} - ${endDate}`);
                doc.fillColor('#000000');

                if (exp.description) {
                    doc.moveDown(0.3);
                    doc.fontSize(10).text(exp.description);
                }

                if (exp.achievements && exp.achievements.length > 0) {
                    exp.achievements.forEach(achievement => {
                        doc.fontSize(10).text(`• ${achievement}`, { indent: 10 });
                    });
                }
                doc.moveDown(0.5);
            });
            doc.moveDown(0.5);
        }

        // Education
        if (resume.education && resume.education.length > 0) {
            doc.fontSize(12).font('Helvetica-Bold').text('EDUCATION');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);

            resume.education.forEach(edu => {
                doc.fontSize(11).font('Helvetica-Bold').text(edu.institution);
                doc.fontSize(10).font('Helvetica').text(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`);

                const startDate = edu.startDate ? new Date(edu.startDate).getFullYear() : '';
                const endDate = edu.endDate ? new Date(edu.endDate).getFullYear() : '';
                if (startDate || endDate) {
                    doc.fontSize(9).fillColor('#666666').text(`${startDate} - ${endDate}`);
                    doc.fillColor('#000000');
                }

                if (edu.grade) {
                    doc.fontSize(10).text(`Grade: ${edu.grade}`);
                }
                doc.moveDown(0.5);
            });
            doc.moveDown(0.5);
        }

        // Skills
        if (resume.skills && resume.skills.length > 0) {
            doc.fontSize(12).font('Helvetica-Bold').text('SKILLS');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);

            const skillNames = resume.skills.map(s => s.name).join(' • ');
            doc.fontSize(10).font('Helvetica').text(skillNames);
            doc.moveDown();
        }

        // Projects
        if (resume.projects && resume.projects.length > 0) {
            doc.fontSize(12).font('Helvetica-Bold').text('PROJECTS');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);

            resume.projects.forEach(project => {
                doc.fontSize(11).font('Helvetica-Bold').text(project.name);
                if (project.description) {
                    doc.fontSize(10).font('Helvetica').text(project.description);
                }
                if (project.technologies && project.technologies.length > 0) {
                    doc.fontSize(9).fillColor('#666666').text(`Technologies: ${project.technologies.join(', ')}`);
                    doc.fillColor('#000000');
                }
                doc.moveDown(0.5);
            });
        }

        // Certifications
        if (resume.certifications && resume.certifications.length > 0) {
            doc.fontSize(12).font('Helvetica-Bold').text('CERTIFICATIONS');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);

            resume.certifications.forEach(cert => {
                doc.fontSize(10).font('Helvetica').text(`• ${cert.name}${cert.issuer ? ` - ${cert.issuer}` : ''}`);
            });
        }

        // Finalize PDF
        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete resume
// @route   DELETE /api/resume
exports.deleteResume = async (req, res) => {
    try {
        await Resume.findOneAndDelete({ user: req.user.id });
        res.json({ message: 'Resume deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
