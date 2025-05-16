import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';

function makeState(prev, now, next, setState) {
    if (prev == null && now == null && next == null) setState(0); // 공강 => 1블럭 - 공강표시
    else if (prev == null && now == null && next != null) setState(1); // 일과 시작 전 => 1블럭 - 첫 수업 표시
    else if (prev != null && now == null && next == null) setState(2); // 일과 끝 => 2블럭 - 이전/다음(end)
    else if (prev != null && now == null && next != null) setState(2); // 수업 간 비는시간 => 2블럭 - 이전/다음
    else setState(3);
    /* 
        나머지 케이스 
        하루에 수업 하난데 그거 진행중 (특이 케이스) => 2블럭 - 현재/다음(end)
        마지막 수업 중 => 2블럭 - 현재/다음(end)
        첫 수업 중 => 2블럭 - 현재/다음
        열심히 수업 중. => 2블럭 - 현재/다음
    */
}

// info와 prev에서 겹치는 속성(course_name, course_room, professor, start, end)를 덮어쓰고, 세부 사항 조정.
function prevInfo(prev, info) {

    info = {
        ...info,
        ...Object.fromEntries(
            Object.entries(prev).filter(([key]) => key in info)
        )
    };
    info.state = "이전 수업";
    info.color = info.isUsing ? "rgba(255, 236, 179, 1)" : "rgba(204, 255, 204, 1)";
    info.comment = info.isUsing ? "강의실이 사용중이에요." : "강의실이 비어있어요.";
    info.isNull = false;

    return info;
}

// info와 now 겹치는 속성(course_name, course_room, professor, start, end)를 덮어쓰고, 세부 사항 조정.
function nowInfo(now, info) {

    info = {
        ...info,
        ...Object.fromEntries(
            Object.entries(now).filter(([key]) => key in info)
        )
    };
    info.state = "현재 수업";
    info.color = "rgba(255, 204, 204, 1)";
    info.comment = "강의실이 사용중이에요.";
    info.isNull = false;

    return info;
}

// info와 now 겹치는 속성(course_name, course_room, professor, start, end)를 덮어쓰고, 세부 사항 조정 및 next가 null인 상황 분기
function nextInfo(next, info) {
    if (next == null) {
        info.course_name = "수업 끝"
        info.comment = "수업 끝! 수고하셨어요.";
        return info;
    }
    info = {
        ...info,
        ...Object.fromEntries(
            Object.entries(next).filter(([key]) => key in info)
        )
    };
    info.state = "다음 수업";
    info.color = info.isUsing ? "rgba(255, 236, 179, 1)" : "rgba(204, 255, 204, 1)";
    info.comment = info.isUsing ? "강의실이 사용중이에요." : "강의실이 비어있어요.";
    info.isNull = false;

    return info;
}

// 시간표 시간을 정규 시간으로 바꿔주는 함수
function formatTime(timeFloat, state = true) {
    if (state) timeFloat = (timeFloat - 1) * 0.5 + 9;
    else timeFloat = (timeFloat - 1) * 0.5 + 9.5;
    const hour = Math.floor(timeFloat);
    const minute = Math.round((timeFloat - hour) * 60);
    const hourStr = hour.toString().padStart(2, '0');
    const minuteStr = minute.toString().padStart(2, '0');
    return `${hourStr}:${minuteStr}`;
}

// 이전/현재/다음 수업 카드를 생성하는 함수
function makeCard(prev, now, next, state) {
    let info_1 = {
        'state': "수업 없음",
        'course_name': "공강",
        'course_room': "없음",
        'professor': "없음",
        'start': 0,
        'end': 0,
        'isUsing': false,
        'color': "rgba(220, 220, 220, 1)",
        'comment': "오늘은 공강이에요",
        'isNull': true
    };
    if (state < 2) { // 1블럭 처리
        switch (state) {
            case 0: // 공강
                break;
            case 1: // 일과 시작
                info_1 = nextInfo(next, info_1);
                break;
        }
        return <Box sx={{
            display: 'flex',
            gap: 2,
            width: '100%',
            pt: 2
        }}>
            <Card variant="outlined" sx={{
                mb: 2,
                flex: 1,
                backgroundColor: info_1.color
            }}>
                <CardContent>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{info_1.state}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{info_1.course_name}</Typography>
                    {
                        !info_1.isNull &&
                        <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#888' }}>{formatTime(info_1.start)} ~ {formatTime(info_1.end, false)}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', paddingLeft: 1 }}>({info_1.course_room})</Typography>
                        </Box>
                    }
                    <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mt: 1 }}>{info_1.professor}</Typography>
                    <Box sx={{ borderBottom: '2px solid black', mt: 0.5, mb: 1 }} />
                    <Typography variant="body2">{info_1.comment}</Typography>
                </CardContent>
            </Card>
        </Box>
    }
    else { // 2블럭 처리
        let info_2 = {
            'state': "수업 없음",
            'course_name': "공강",
            'course_room': "없음",
            'professor': "없음",
            'start': 0,
            'end': 0,
            'isUsing': false,
            'color': "rgba(220, 220, 220, 1)",
            'comment': "오늘은 공강이에요",
            'isNull': true
        };
        switch (state) {
            case 2:
                info_1 = prevInfo(prev, info_1);
                info_2 = nextInfo(next, info_2);
                break;
            case 3:
                info_1 = nowInfo(now, info_1);
                info_2 = nextInfo(next, info_2);
                break;
        }
        return <Box sx={{
            display: 'flex',
            gap: 2,
            width: '100%',
            pt: 2
        }}>
            <Card variant="outlined" sx={{
                mb: 2,
                flex: 1,
                backgroundColor: info_1.color
            }}>
                <CardContent>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{info_1.state}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{info_1.course_name}</Typography>
                    {
                        !info_1.isNull &&
                        <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#888' }}>{formatTime(info_1.start)} ~ {formatTime(info_1.end, false)}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', paddingLeft: 1 }}>({info_1.course_room})</Typography>
                        </Box>
                    }
                    <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mt: 1 }}>{info_1.professor}</Typography>
                    <Box sx={{ borderBottom: '2px solid black', mt: 0.5, mb: 1 }} />
                    <Typography variant="body2">{info_1.comment}</Typography>
                </CardContent>
            </Card>
            <Card variant="outlined" sx={{
                mb: 2,
                flex: 1,
                backgroundColor: info_2.color
            }}>
                <CardContent>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{info_2.state}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{info_2.course_name}</Typography>
                    {
                        !info_2.isNull &&
                        <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#888' }}>{formatTime(info_2.start)} ~ {formatTime(info_2.end, false)}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', paddingLeft: 1 }}>({info_2.course_room})</Typography>
                        </Box>
                    }
                    <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mt: 1 }}>{info_2.professor}</Typography>
                    <Box sx={{ borderBottom: '2px solid black', mt: 0.5, mb: 1 }} />
                    <Typography variant="body2">{info_2.comment}</Typography>
                </CardContent>
            </Card>
        </Box>
    }
}

export function NowScheduleComponent({ prev, now, next }) {
    const [state, setState] = useState(0);

    useEffect(() => {
        makeState(prev, now, next, setState);
    }, [prev, now, next]);

    // state 체크용. 의미X
    useEffect(() => {
        console.log("state: ", state);
    }, [state]);

    return (makeCard(prev, now, next, state));
}