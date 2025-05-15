/* 기능: 내 시간표 */
import BottomSheet from './BottomSheet.js';
import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import GanttChart from './GanttChart.js';
import { useState } from "react";
import { NowSchedule } from './NowSchedule.js';

function MySchedulePage() {
    const [courseList, setCoursesList] = useState([]);

    return (
        <MainFrame>
            <NaviBar />
            <NowSchedule courseList={courseList}></NowSchedule>
            <GanttChart courses={courseList}></GanttChart>
            <BottomSheet courseList={courseList} setCourseList={setCoursesList} />
        </MainFrame>
    );
}

export default MySchedulePage;