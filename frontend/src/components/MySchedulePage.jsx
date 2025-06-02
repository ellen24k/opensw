/* 기능: 내 시간표 */
import BottomSheet from './BottomSheet.jsx';
import MainFrame from './MainFrame.jsx';
import NaviBar from './NaviBar.jsx';
import GanttChart from './GanttChart.jsx';
import { useState, useEffect } from 'react';
import { NowScheduleState } from './NowScheduleState.jsx';
import { Box, Button } from '@mui/material';

function MySchedulePage() {

    const [isReset, setIsReset] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
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
        if (courseList.length) setIsChecked(true);
    }, [courseList]);


    return (
        <MainFrame>
            <NaviBar />
            <Box display="flex" width="100%" gap={2} sx={{ marginTop: 2 }}>
                {courseList.length === 0 ?
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ width: '50%', borderRadius: 1, fontFamily: "NanumSquare" }}
                        disabled
                    >
                        초기화
                    </Button> :
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ width: '50%', borderRadius: 1, fontFamily: "NanumSquare" }}
                        onClick={() => {
                            setIsReset(true);
                            setCoursesList([]);
                        }}
                    >
                        초기화
                    </Button>}
                {isChecked ? courseList.length ?
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ width: '50%', borderRadius: 1, fontFamily: "NanumSquare" }}
                        disabled
                    >
                        시간표 한번에 등록
                    </Button> :
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ width: '50%', borderRadius: 1, fontFamily: "NanumSquare" }}
                        onClick={() => setIsChecked(false)}
                    >
                        시간표 한번에 등록
                    </Button> :
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ width: '50%', borderRadius: 1, fontFamily: "NanumSquare" }}
                        onClick={() => setIsChecked(true)}
                    >
                        과목 직접 선택하기
                    </Button>}
            </Box>
            <NowScheduleState courseList={courseList}></NowScheduleState>
            <GanttChart courses={courseList}></GanttChart>
            <div style={{ height: "60px" }} />
            <BottomSheet courseList={courseList} setCourseList={setCoursesList} isReset={isReset} setIsReset={setIsReset} isChecked={isChecked} />
        </MainFrame >
    );
}

export default MySchedulePage;
