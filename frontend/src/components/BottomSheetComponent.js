import { Card, CardContent, Typography, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useState } from 'react';

function addCourseList(group, setCourseList) {
    group.courses.map((course) => { setCourseList((prev) => [...prev, course]) });
}
function removeCourseList(group, setCourseList) {
    setCourseList(prevList => prevList.filter(course => course.course_code !== group.courses[0].course_code));
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

                <IconButton
                    onClick={() => {
                        isSelected ? removeCourseList(group, setCourseList) : addCourseList(group, setCourseList);
                        setIsSelected(!isSelected);
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