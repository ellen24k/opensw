/* 기능: 강의실 시간표 */

import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import { Button } from "@mui/material";
import ClassFilterArea from "./ClassFilterArea.js"
import GanttChart from "./GanttChart.js"
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { SelectedOptionIdSetterContext } from "./NaviContext.js";

function ViewClassSchedulePage() {
    const [courses, setCourses] = useState(null);
    const { classroomName } = useParams();
    const setSelectedOptionId = useContext(SelectedOptionIdSetterContext)

    useEffect(() => {
        setSelectedOptionId(1)
    }, [])

    return (
        <MainFrame>
            <NaviBar />
            <ClassFilterArea setCourses={setCourses} classroomName={classroomName}></ClassFilterArea>
            <GanttChart courses={courses}></GanttChart>
        </MainFrame>
    )
}

export default ViewClassSchedulePage;