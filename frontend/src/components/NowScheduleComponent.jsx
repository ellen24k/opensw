import { Box, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import {
    periodStart,
    periodEnd,
} from '../utils/time.js';

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
function prevInfo(prev, info, isUsingPrev) {
    if (prev == null) return info;
    info = {
        ...info,
        ...Object.fromEntries(
            Object.entries(prev).filter(([key]) => key in info)
        )
    };
    info.isUsing = isUsingPrev;
    info.state = "이전 수업";
    info.color = info.isUsing ? "rgba(255, 236, 179, 1)" : "rgba(204, 255, 204, 1)";
    info.comment = info.isUsing ? "강의실이 사용중이에요." : "강의실이 비어있어요.";
    info.isNull = false;

    return info;
}

// info와 now 겹치는 속성(course_name, course_room, professor, start, end)를 덮어쓰고, 세부 사항 조정.
function nowInfo(now, info, isUsingNow) {
    if (now == null) return info;
    info = {
        ...info,
        ...Object.fromEntries(
            Object.entries(now).filter(([key]) => key in info)
        )
    };
    info.isUsing = isUsingNow;
    info.state = "현재 수업";
    info.color = "rgba(255, 204, 204, 1)";
    info.comment = "강의실이 사용중이에요.";
    info.isNull = false;

    return info;
}

// info와 now 겹치는 속성(course_name, course_room, professor, start, end)를 덮어쓰고, 세부 사항 조정 및 next가 null인 상황 분기
function nextInfo(next, info, isUsingNext) {
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
    info.isUsing = isUsingNext;
    info.state = "다음 수업";
    info.color = info.isUsing ? "rgba(255, 236, 179, 1)" : "rgba(204, 255, 204, 1)";
    info.comment = info.isUsing ? "강의실이 사용중이에요." : "강의실이 비어있어요.";
    info.isNull = false;

    return info;
}

// 이전/현재/다음 수업 카드를 생성하는 함수
function makeCard(info1, info2) {
    return (
        <Box sx={{ display: 'flex', gap: 2, width: '100%', pt: 2 }}>
            {info1 && (
                <Card variant="outlined" sx={{ mb: 2, flex: 1, backgroundColor: info1.color }}>
                    <CardContent>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: "NanumSquare" }}>{info1.state}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: "NanumSquare" }}>{info1.course_name}</Typography>
                        {!info1.isNull &&
                            <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 0.5 }}>
                                <Typography variant="body2" sx={{ color: '#888', fontFamily: "NanumSquare" }}>{periodStart(info1.start)} ~ {periodEnd(info1.end)}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', paddingLeft: 1, fontFamily: "NanumSquare" }}>({info1.course_room})</Typography>
                            </Box>}
                        <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mt: 1, fontFamily: "NanumSquare" }}>{info1.professor}</Typography>
                        <Box sx={{ borderBottom: '2px solid black', mt: 0.5, mb: 1 }} />
                        <Typography variant="body2" sx={{ fontFamily: "NanumSquare" }}>{info1.comment}</Typography>
                    </CardContent>
                </Card>
            )}
            {info2 && (
                <Card variant="outlined" sx={{ mb: 2, flex: 1, backgroundColor: info2.color }}>
                    <CardContent>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: "NanumSquare" }}>{info2.state}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: "NanumSquare" }}>{info2.course_name}</Typography>
                        {!info2.isNull &&
                            <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 0.5 }}>
                                <Typography variant="body2" sx={{ color: '#888', fontFamily: "NanumSquare" }}>{periodStart(info2.start)} ~ {periodEnd(info2.end)}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', paddingLeft: 1, fontFamily: "NanumSquare" }}>({info2.course_room})</Typography>
                            </Box>}
                        <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mt: 1, fontFamily: "NanumSquare" }}>{info2.professor}</Typography>
                        <Box sx={{ borderBottom: '2px solid black', mt: 0.5, mb: 1 }} />
                        <Typography variant="body2" sx={{ fontFamily: "NanumSquare" }}>{info2.comment}</Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

export function NowScheduleComponent({ prev, now, next, isUsingPrev, isUsingNow, isUsingNext }) {
    const [state, setState] = useState(0);
    const info1 = useMemo(() => {
        const defaultInfo = {
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
            case 0:
                return defaultInfo;
            case 1:
                return nextInfo(next, { ...defaultInfo }, isUsingNext);
            case 2:
                return prevInfo(prev, { ...defaultInfo }, isUsingPrev);
            case 3:
                return nowInfo(now, { ...defaultInfo }, isUsingNow);
        }
    }, [state, prev, now, next, isUsingPrev, isUsingNow, isUsingNext]);
    const info2 = useMemo(() => {
        const defaultInfo = {
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
            case 0:
                return null;
            case 1:
                return null;
            case 2:
                return nextInfo(next, { ...defaultInfo }, isUsingNext);
            case 3:
                return nextInfo(next, { ...defaultInfo }, isUsingNext);
        }
    }, [state, prev, now, next, isUsingPrev, isUsingNow, isUsingNext]);

    useEffect(() => {
        makeState(prev, now, next, setState, isUsingPrev, isUsingNow, isUsingNext);
    }, [prev, now, next]);



    return (makeCard(info1, info2));
}
