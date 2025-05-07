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
        const response = await axios.get(`https://opensw-api-dev.ellen24k.kro.kr/query-building-list/`);
        buildingListCache = response.data;
        return response.data;
    } catch (error) {
        throw error;
    }
};

let classroomList = null;

export const fetchClassroomList = async () => {
    if (classroomList !== null) return classroomList;
    console.log(process.env.REACT_APP_API_BASE_URL);

    try {
        const response = await axios.get(`https://opensw-api-dev.ellen24k.kro.kr/query-classroom-list/`);
        classroomList = response.data;
        return response.data;
    } catch (error) {
        throw error;
    }
};