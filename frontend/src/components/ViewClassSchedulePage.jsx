/* 기능: 강의실 시간표 */

import MainFrame from './MainFrame.jsx';
import NaviBar from './NaviBar.jsx';
import { Button, Stack, Typography } from '@mui/material';
import ClassFilterArea from './ClassFilterArea.jsx';
import GanttChart from './GanttChart.jsx';
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
                <Typography sx={{ fontFamily: "NanumSquare" }} variant="body1">진행 중인 수업은 <span style={{ color: "#FF0000" }}>빨간색</span>으로 표시됩니다.</Typography>
            </Stack>
            <GanttChart courses={courses}></GanttChart>
        </MainFrame>
    );
}

export default ViewClassSchedulePage;