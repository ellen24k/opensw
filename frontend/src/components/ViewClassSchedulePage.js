/* 기능: 강의실 시간표 */

import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import { Button } from "@mui/material";
import ClassFilterArea from "./ClassFilterArea.js"
import GanttChart from "./GanttChart.js"
import { useState } from "react";

function ViewClassSchedulePage() {
    const [courses, setCourses] = useState(null);

    return (
        <MainFrame>
            <NaviBar />
            <ClassFilterArea setCourses={setCourses}></ClassFilterArea>
            <GanttChart courses={courses}></GanttChart>
        </MainFrame>
    )
}

export default ViewClassSchedulePage;