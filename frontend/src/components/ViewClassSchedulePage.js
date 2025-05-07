/* 기능: 강의실 시간표 */

import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import { Button } from "@mui/material";
import ClassFilterArea from "./ClassFilterArea.js"
import GanttChart from "./GanttChart.js"

function ViewClassSchedulePage() {


    return (
        <MainFrame>
            <NaviBar />
            <ClassFilterArea></ClassFilterArea>
            <GanttChart></GanttChart>
        </MainFrame>
    )
}

export default ViewClassSchedulePage;