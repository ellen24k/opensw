// src/api.js
import axios from 'axios';
import { useState } from 'react';

export const fetchClassroomSchedule = async (classroomId) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/query-classroom/${classroomId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

let buildingListCache = null;

export const fetchBuildingList = async () => {
    if (buildingListCache !== null) return buildingListCache

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/query-building-list/`);
        buildingListCache = response.data;
        return response.data;
    } catch (error) {
        throw error;
    }
};

let classroomList = null;

export const fetchClassroomList = async () => {
    if (classroomList !== null) return classroomList;

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/query-classroom-list/`);
        classroomList = response.data;
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchFilteredClassroom = async (filter) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/query-classroom-list/${filter}`);
        classroomList = response.data;
        return response.data;
    } catch (error) {
        throw error;
    }
};