// src/api.js
import axios from 'axios';

let buildingListCache = null;

export const fetchBuildingList = async () => {
    if(buildingListCache !== null) return buildingListCache;

    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/query-building-list/`
        );
        buildingListCache = response.data;
        return response.data;
    } catch(error) {
        throw error;
    }
};

let classroomList = null;

export const fetchClassroomList = async () => {
    if(classroomList !== null) return classroomList;

    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/query-classroom-list/`
        );
        classroomList = response.data;
        return response.data;
    } catch(error) {
        throw error;
    }
};

export const fetchFilteredClassroom = async (filter) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/query-classroom-list/${filter}`
        );
        return response.data;
    } catch(error) {
        throw error;
    }
};

export const fetchCoursesFromClassroom = async (buildingId, classroomId) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/query-classroom-table/${buildingId}/${classroomId}`
        );
        return response.data;
    } catch(error) {
        throw error;
    }
};

export const fetchClassList = async (classname) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/query-course-table/${classname}`
        );
        return response.data;
    } catch(error) {
        throw error;
    }
};

export const fetchEmptyClassroomInBuilding = async (building, day) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/query-classroom-period-ext/${building}/${day}`
        );
        return response.data;
    } catch(error) {
        throw error;
    }
};
