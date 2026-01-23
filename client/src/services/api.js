import axios from 'axios';

const API_URL = '/api';

// Job Services
export const jobService = {
    getJobs: async (params = {}) => {
        const response = await axios.get(`${API_URL}/jobs`, { params });
        return response.data;
    },

    getJob: async (id) => {
        const response = await axios.get(`${API_URL}/jobs/${id}`);
        return response.data;
    },

    createJob: async (jobData) => {
        const response = await axios.post(`${API_URL}/jobs`, jobData);
        return response.data;
    },

    updateJob: async (id, jobData) => {
        const response = await axios.put(`${API_URL}/jobs/${id}`, jobData);
        return response.data;
    },

    deleteJob: async (id) => {
        const response = await axios.delete(`${API_URL}/jobs/${id}`);
        return response.data;
    },

    getMyJobs: async () => {
        const response = await axios.get(`${API_URL}/jobs/my-jobs`);
        return response.data;
    }
};

// Application Services
export const applicationService = {
    applyToJob: async (jobId, data) => {
        const response = await axios.post(`${API_URL}/applications/${jobId}`, data);
        return response.data;
    },

    getMyApplications: async () => {
        const response = await axios.get(`${API_URL}/applications/my-applications`);
        return response.data;
    },

    getJobApplicants: async (jobId) => {
        const response = await axios.get(`${API_URL}/applications/job/${jobId}`);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await axios.put(`${API_URL}/applications/${id}/status`, { status });
        return response.data;
    },

    toggleSaveJob: async (jobId) => {
        const response = await axios.post(`${API_URL}/applications/save/${jobId}`);
        return response.data;
    },

    getSavedJobs: async () => {
        const response = await axios.get(`${API_URL}/applications/saved`);
        return response.data;
    }
};

// Resume Services
export const resumeService = {
    saveResume: async (resumeData) => {
        const response = await axios.post(`${API_URL}/resume`, resumeData);
        return response.data;
    },

    getMyResume: async () => {
        const response = await axios.get(`${API_URL}/resume`);
        return response.data;
    },

    getResumeById: async (id) => {
        const response = await axios.get(`${API_URL}/resume/${id}`);
        return response.data;
    },

    downloadResume: (id) => {
        window.open(`${API_URL}/resume/download/${id}`, '_blank');
    },

    deleteResume: async () => {
        const response = await axios.delete(`${API_URL}/resume`);
        return response.data;
    }
};
