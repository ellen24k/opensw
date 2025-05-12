/* 기능: 강의실 시간표 */

import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import { Button } from "@mui/material";
import ClassFilterArea from "./ClassFilterArea.js"
import GanttChart from "./GanttChart.js"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SelectedOptionSetterContext } from "./SelectedOptionContext.js";

function ViewClassSchedulePage() {
    const [courses, setCourses] = useState(null);
    const { classroomName } = useParams();
    const SelectedOptionSetter = useContext(SelectedOptionSetterContext)

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