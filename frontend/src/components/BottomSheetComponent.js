import { Card, CardContent, Typography, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useState } from 'react';

// 이미 존재하는 과목이거나 시간대가 겹치지 않는다면 수강 리스트에 추가하는 함수
function addCourseList(group, courseList, setCourseList) {
    try {
        group.courses.map((course) => {
            courseList.map((ex_course) => {
                if (ex_course.start <= course.start && course.start <= ex_course.end || ex_course.start <= course.end && course.end <= ex_course.end) {
                    throw '시간이 겹치는 수업이 존재합니다.';
                }
                if (course.course_code == ex_course.course_code) {
                    throw '이미 존재하는 과목입니다.'
                }
            })
        });
        group.courses.map((course) => {
            setCourseList((prev) => [...prev, course])
        });
        return true;
    }
    catch (err) {
        alert(err);
        return false;
    }
}
// 이미 리스트에 들어가 있는 과목을 제거하는 함수
function removeCourseList(group, setCourseList) {
    setCourseList(prevList => prevList.filter(course => course.org_time !== group.org_time));
}

export function BottomSheetComponent({ courseList, setCourseList, group, index }) {
    const course = group.courses[0];
    const [isSelected, setIsSelected] = useState(group.isSelected);

    return (
        <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent sx={{ position: 'relative', paddingRight: 6 }}>
                <Typography variant="h6" fontWeight="bold">
                    {course.course_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {course.professor}
                </Typography>
                <Typography sx={{ mt: 0.5 }}>
                    {course.org_time}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {course.course_code}
                </Typography>

                <IconButton // 상황에 맞게 추가/제거 버튼 활성화
                    onClick={() => {
                        if (isSelected) {
                            removeCourseList(group, setCourseList);
                            setIsSelected(false);
                        }
                        else {
                            const success = addCourseList(group, courseList, setCourseList);
                            if (success) setIsSelected(true);
                        }
                    }}
                    sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}
                    color="primary"
                >
                    {isSelected ? <RemoveCircleIcon sx={{ color: 'rgba(245, 35, 35, 0.7)' }} fontSize="large" /> : <AddCircleIcon fontSize="large" />}
                </IconButton>
            </CardContent>
        </Card>
    );
}