/* 기능: 내 시간표 */
import BottomSheet from './BottomSheet.js';
import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import GanttChart from './GanttChart.js';
import { SelectedOptionIdSetterContext } from "./NaviContext.js";
import { useContext, useEffect, useState } from "react";

function MySchedulePage() {
    const [course, setCourses] = useState([]);
    const setSelectedOptionId = useContext(SelectedOptionIdSetterContext)
    useEffect(() => {
        setSelectedOptionId(2)
    }, [])

    return (
        <MainFrame>
            <NaviBar />
            <GanttChart courses={course}></GanttChart>
            <BottomSheet classListTable={course} setClassListTable={setCourses} />
        </MainFrame>
    )
}

export default MySchedulePage;