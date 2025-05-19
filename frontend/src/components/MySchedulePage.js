/* 기능: 내 시간표 */
import BottomSheet from './BottomSheet.js';
import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import GanttChart from './GanttChart.js';
import { useState, useEffect } from "react";
import { NowScheduleState } from './NowScheduleState.js';
import { Box, Button } from '@mui/material';

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
            <Box display="flex" width="100%" gap={2} sx={{ marginTop: 2 }}>
                {courseList.length === 0 ?
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ width: '50%', borderRadius: 1 }}
                        disabled
                    >
                        초기화
                    </Button> :
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ width: '50%', borderRadius: 1 }}
                        onClick={() => {
                            setIsReset(true);
                            setCoursesList([]);
                        }}
                    >
                        초기화
                    </Button>}
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ width: '50%', borderRadius: 1 }}
                >
                    {isReset ? "true" : "false"}
                </Button>
            </Box>
            <NowScheduleState courseList={courseList}></NowScheduleState>
            <GanttChart courses={courseList}></GanttChart>
            <div style={{ height: "60px" }} />
            <BottomSheet courseList={courseList} setCourseList={setCoursesList} isReset={isReset} setIsReset={setIsReset} />
        </MainFrame >
    );
}

export default MySchedulePage;
