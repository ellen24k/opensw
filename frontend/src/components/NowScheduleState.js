import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { NowScheduleComponent } from './NowScheduleComponent';

function updateClock(prev, now, next, setPrev, setNow, setNext, todayCourseList) {
    const nowTime = new Date();
    const time = parseFloat(
        nowTime.getHours() + (nowTime.getMinutes() / 60)
    ).toFixed(3);

    let tempPrev = null;
    let tempNow = null;
    let tempNext = null;

    for (const course of todayCourseList) {
        const start = (course.start - 1) * 0.5 + 9;
        const end = (course.end - 1) * 0.5 + 9;

        if (end < time) {
            tempPrev = course;
        } else if (start <= time && time <= end) {
            tempNow = course;
        } else if (time < start) {
            tempNext = course;
            break;
        }
    }

    // 이전 값과 다를 때만 setState 호출 => 불필요한 렌더링 방지
    if (prev?.course_code !== tempPrev?.course_code) {
        setPrev(tempPrev);
    }
    if (now?.course_code !== tempNow?.course_code) {
        setNow(tempNow);
    }
    if (next?.course_code !== tempNext?.course_code) {
        setNext(tempNext);
    }

    return time;
}
function nowDay() {

    const now = new Date();
    const nowDay = now.getDay();
    const dayofWeek = ['일', '월', '화', '수', '목', '금', '토'];
    return dayofWeek[nowDay];
}

function makeTodayCourseList(courseList, day) {
    const todayCourseList = courseList.filter(course => course.day == day).sort((a, b) => a.start - b.start);

    return todayCourseList;
}

export function NowScheduleState({ courseList }) {

    /* 전부 null이면 공강 */
    const [prevCourse, setPrevCourse] = useState(null);
    const [nowCourse, setNowCourse] = useState(null);
    const [nextCourse, setNextCourse] = useState(null);

    const [day, setDay] = useState(nowDay());
    const [todayCourseList, setTodayCourseList] = useState(makeTodayCourseList(courseList, day));
    const [clock, setClock] = useState(updateClock(prevCourse, nowCourse, nextCourse, setPrevCourse, setNowCourse, setNextCourse, todayCourseList));
    // 1초마다 clock과 day 갱신
    useEffect(() => {
        const timer = setInterval(() => {
            setClock(updateClock(prevCourse, nowCourse, nextCourse, setPrevCourse, setNowCourse, setNextCourse, todayCourseList));
            setDay(nowDay());
        }, 1000);
        return () => clearInterval(timer); // 언마운트 시 클리어
    }, []);

    // day가 바뀔 때만 todayCourseList 업데이트
    useEffect(() => {
        setTodayCourseList(makeTodayCourseList(courseList, day));

    }, [day, courseList]);

    // state 체크용. 의미 X
    useEffect(() => {
        console.log('[🟠 prevCourse]:', prevCourse);
        console.log('[🟢 nowCourse]:', nowCourse);
        console.log('[🔵 nextCourse]:', nextCourse);
        console.log(todayCourseList);
    }, [prevCourse, nowCourse, nextCourse, clock, todayCourseList]);

    return (<Box sx={{
        display: 'flex',
        gap: 2,
        width: '100%',
        pt: 2
    }}>
        <NowScheduleComponent prev={prevCourse} now={nowCourse} next={nextCourse}></NowScheduleComponent>
    </Box>)
}