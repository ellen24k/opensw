/* 기능: 내 시간표 */
import BottomSheet from './BottomSheet.js';
import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import GanttChart from './GanttChart.js';
import { useState } from "react";
import { NowScheduleState } from './NowScheduleState.js';

function MySchedulePage() {
    const [courseList, setCoursesList] = useState([]);

    return (
        <MainFrame>
            <NaviBar />
            <NowScheduleState courseList={courseList}></NowScheduleState>
            <GanttChart courses={courseList}></GanttChart>
            <BottomSheet courseList={courseList} setCourseList={setCoursesList} />
        </MainFrame>
    );
}

export default MySchedulePage;