import { BottomSheetComponent } from './BottomSheetComponent'; import { Box } from '@mui/material';

function groupByOrgTime(classList) {
    const grouped = {};

    classList.forEach(course => {
        const key = course.org_time;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(course);
    });

    return Object.entries(grouped).map(([org_time, group]) => ({
        org_time,
        courses: group,
        isSelected: false
    }));
}

export function BottomSheetManager({ courseList, setCourseList, classList }) {

    const courseGroups = groupByOrgTime(classList);
    return (
        <Box
            sx={{
                maxHeight: '60vh',          // 화면 높이의 70%만 사용
                overflowY: 'auto',          // 세로 스크롤 허용
                padding: 2,
                backgroundColor: '#fafafa',
                borderRadius: '12px',
                marginLeft: -3,
                paddingRight: 3
            }}
        >
            {courseGroups.map((group, index) => {
                return <BottomSheetComponent courseList={courseList} setCourseList={setCourseList} group={group} index={index}></BottomSheetComponent>
            })}
        </Box>
    );
}