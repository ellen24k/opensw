// src/api.js
import axios from 'axios';

export const fetchClassroomSchedule = async (classroomId) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/query-classroom/${classroomId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};