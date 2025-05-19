import { useState, useEffect } from 'react';
import { NowScheduleComponent } from './NowScheduleComponent';
import { fetchCoursesFromClassroom } from "../api.js";

// 매 초 마다 현재 시간을 갱신하며 금일의 수업리스트와 상호작용하는 함수
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
        const end = (course.end - 1) * 0.5 + 9.5;

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
//api를 사용하기 위해 course_room에서 building_id를 추출하는 함수
function splitRoom(course_room) {
    const buildingList = [
        "1공",
        "2공",
        "3공",
        "국제",
        "글로컬산학협력관",
        "대학원동",
        "메종트리앙글르",
        "무용",
        "미디어",
        "미술",
        "사범",
        "사회",
        "상경",
        "서관",
        "소프트",
        "음악",
        "인문",
        "종합실험동",
        "체",
        "체육",
        "학군단"
    ];
    for (const building of buildingList) {
        if (course_room.startsWith(building)) {
            return {
                building,
                room: course_room.slice(building.length)
            };
        }
    }
}
//페이지가 렌더링되거나 매 00분, 30분마다 강의실이 사용중인지 체크하는 함수
async function checkIsUsing(course, now) {
    if (course == null) return false;
    const id = splitRoom(course.course_room);
    console.log(id);
    try {
        const data = await fetchCoursesFromClassroom(id.building, id.room);
        const todayCourseListInRoom = data.filter(data => data.day == course.day).sort((a, b) => a.start - b.start);
        for (const course of todayCourseListInRoom) {
            const start = (course.start - 1) * 0.5 + 9;
            const end = (course.end - 1) * 0.5 + 9.5;
            if (start <= now && now <= end) return true;
        }
        return false;

    } catch (err) {
        console.error("API 호출 실패:", err);
        return false;
    }
}
// 현재 요일을 반환하는 함수
function nowDay() {

    const now = new Date();
    const nowDay = now.getDay();
    const dayofWeek = ['일', '월', '화', '수', '목', '금', '토'];
    return dayofWeek[nowDay];
}

// 금일의 수업을 시간순으로 정렬한 리스트
function makeTodayCourseList(courseList, day) {
    const todayCourseList = courseList.filter(course => course.day == day).sort((a, b) => a.start - b.start);

    return todayCourseList;
}

export function NowScheduleState({ courseList }) {

    /* 이전 | 현재 | 다음 수업을 담는 변수 */
    /* 각 변수의 상태에 따른 분기는 NowScheduleComponent.js에서 다루고 있음. */
    const [prevCourse, setPrevCourse] = useState(null);
    const [nowCourse, setNowCourse] = useState(null);
    const [nextCourse, setNextCourse] = useState(null);
    const [isUsingPrev, setIsUsingPrev] = useState(false);
    const [isUsingNow, setIsUsingNow] = useState(false);
    const [isUsingNext, setIsUsingNext] = useState(false);

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

    // 디버깅용 함수. 프로그램에 영향 X
    useEffect(() => {
        console.log('[🟠 prevCourse]:', prevCourse);
        console.log('[🟢 nowCourse]:', nowCourse);
        console.log('[🔵 nextCourse]:', nextCourse);
        console.log('[🟠 isUsingPrev]:', isUsingPrev);
        console.log('[🟢 isUsingNow]:', isUsingNow);
        console.log('[🔵 isUsingNext]:', isUsingNext);

        console.log("courseList");

        console.log(courseList);

    }, [prevCourse, nowCourse, nextCourse, clock, todayCourseList, isUsingPrev, isUsingNow, isUsingNext]);

    //00분, 30분마다 updateIsUsing 실행
    useEffect(() => {
        const now = new Date();

        async function updateIsUsing() {

            const isUsingPrev = await checkIsUsing(prevCourse, clock);
            const isUsingNow = await checkIsUsing(nowCourse, clock);
            const isUsingNext = await checkIsUsing(nextCourse, clock);
            setIsUsingPrev(isUsingPrev);
            setIsUsingNow(isUsingNow);
            setIsUsingNext(isUsingNext);
        }

        if (now.getMinutes() % 30 == 0) {
            updateIsUsing();
        }
    }, [clock]);

    // prevCourse, nowCourse, nextCourse 중 하나라도 변경이 일어나면 updateIsUsing 실행
    useEffect(() => {

        async function updateIsUsing() {

            const isUsingPrev = await checkIsUsing(prevCourse, clock);
            const isUsingNow = await checkIsUsing(nowCourse, clock);
            const isUsingNext = await checkIsUsing(nextCourse, clock);
            setIsUsingPrev(isUsingPrev);
            setIsUsingNow(isUsingNow);
            setIsUsingNext(isUsingNext);
        }
        updateIsUsing();
    }, [prevCourse, nowCourse, nextCourse]);

    return <NowScheduleComponent prev={prevCourse} now={nowCourse} next={nextCourse} isUsingPrev={isUsingPrev} isUsingNow={isUsingNow} isUsingNext={isUsingNext}></NowScheduleComponent>
}