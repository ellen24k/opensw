import { BottomSheetComponent } from './BottomSheetComponent';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

// 같은 수업이지만 화,목 수업이면 화요일 객체, 목요일 객체로 나눠져 있음. 이를 합쳐주는 함수
function groupByOrgTime(classList, courseList) {
    const grouped = {};

    classList.forEach(course => {
        const key = course.org_time;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(course);
    });

    const selectedCodes = new Set((courseList ?? []).map(c => c.org_time));
    console.log("selectedCodes");
    console.log(selectedCodes);
    console.log(courseList);


    return Object.entries(grouped).map(([org_time, group]) => {
        const hasSelected = group.some(course => selectedCodes.has(course.org_time));
        return {
            org_time,
            courses: group,
            isSelected: hasSelected
        };
    });
}

export function BottomSheetManager({ courseList, setCourseList, classList, isReset, setIsReset }) {

    const [courseGroups, setCourseGroups] = useState(() => groupByOrgTime(classList, courseList));

    // isReset이 변경되면 courseGroups 재초기화
    useEffect(() => {
        const newGroups = groupByOrgTime(classList, courseList);
        setCourseGroups(newGroups);
        if (isReset) setIsReset(false); // 리셋 완료 후 false 처리
    }, [isReset, setIsReset]);

    return (
        <Box
            sx={{
                maxHeight: '60vh',          // 화면 높이의 60%만 사용
                overflowY: 'auto',          // 세로 스크롤 허용
                padding: 2,
                backgroundColor: '#fafafa',
                borderRadius: '12px',
                marginLeft: -3,
                paddingRight: 3
            }}
        >
            {courseGroups.map((group, index) => {
                return <BottomSheetComponent key={group.org_time} courseList={courseList} setCourseList={setCourseList} group={group} index={index} courseGroups={courseGroups} setCourseGroups={setCourseGroups}></BottomSheetComponent>
            })}
        </Box>
    );
}