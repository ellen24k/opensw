// src/api.js
import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://opensw-api-dev.ellen24k.kro.kr';
// const API_BASE_URL = 'http://localhost:8000';

export const fetchClassroomSchedule = async (classroomId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/query-classroom/${classroomId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};