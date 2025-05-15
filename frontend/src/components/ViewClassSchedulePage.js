/* 기능: 강의실 시간표 */

import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import { Button, Stack, Typography } from "@mui/material";
import ClassFilterArea from "./ClassFilterArea.js";
import GanttChart from "./GanttChart.js";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ErrorIcon from '@mui/icons-material/Error';

function ViewClassSchedulePage() {
    const [courses, setCourses] = useState(null);
    const { classroomName } = useParams();

    return (
        <MainFrame spacing={2}>
            <NaviBar />
            <ClassFilterArea setCourses={setCourses} classroomName={classroomName}></ClassFilterArea>
            <Stack direction="row" alignItems="center">
                <ErrorIcon />
                <Typography variant="body1">진행 중인 수업은 <span style={{ color: "#FF0000" }}>빨간색</span>으로 표시됩니다.</Typography>
            </Stack>
            <GanttChart courses={courses}></GanttChart>
        </MainFrame>
    );
}

export default ViewClassSchedulePage;