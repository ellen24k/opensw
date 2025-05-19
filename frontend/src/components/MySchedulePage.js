/* 기능: 내 시간표 */
import BottomSheet from './BottomSheet.js';
import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import GanttChart from './GanttChart.js';
import { useState, useEffect } from "react";
import { NowScheduleState } from './NowScheduleState.js';

function MySchedulePage() {

    const [isReset, setIsReset] = useState(false);
    /*페이지 새로고침 시, courseList가 초기화 되는 부분을 방지하기 위해 localStorage 사용*/
    const [courseList, setCoursesList] = useState(() => {
        try {
            const stored = localStorage.getItem('courseList');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('courseList 복원 실패:', e);
            return [];
        }
    });
    useEffect(() => {
        localStorage.setItem('courseList', JSON.stringify(courseList));
    }, [courseList]);


    return (
        <MainFrame>
            <NaviBar />
            <NowScheduleState courseList={courseList}></NowScheduleState>
            <GanttChart courses={courseList}></GanttChart>
            <div style={{ height: "60px" }} />
            <BottomSheet courseList={courseList} setCourseList={setCoursesList} isReset={isReset} setIsReset={setIsReset} />
        </MainFrame>
    );
}

export default MySchedulePage;
