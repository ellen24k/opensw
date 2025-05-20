import React, { useState, useEffect, useRef } from "react";
import { fetchClassList } from '../api';
import { BottomSheetManager } from "./BottomSheetManager";
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import "../styles/BottomSheet.css";

//org_time 형식에 맞게 수정하는 함수
function normalizeOrgTime(rawTime) {
    return rawTime.split('/').map(part => {
        const match = part.match(/([가-힣]+)([\d,]+)\(([^)]+)\)/);
        if (!match) return part;
        const day = match[1];
        const times = match[2].split(',').map(Number);
        const room = match[3];
        const start = Math.min(...times);
        const end = Math.max(...times);
        return `${day}${start}~${end}(${room})`;
    }).join(', ');
}
// 복사된 웹정보 시간표를 courseList 형식에 맞게 수정하여 courseList를 반환하는 함수
function parseCourseList(rawText) {
    const lines = rawText.trim().split('\n');
    const result = [];

    for (const line of lines) {
        const fields = line.trim().split('\t');
        if (fields.length < 9) continue;

        const course_code = fields[2];
        const course_name = fields[4];
        const professor = fields[7];
        const raw_time = fields[8].replace(/【.*?】/g, '');
        const org_time = normalizeOrgTime(raw_time); // 전체 표시용

        const blocks = raw_time.split('/');
        const lastBlockHasRoom = /\(([^)]+)\)$/.test(blocks[blocks.length - 1]);
        let sharedRoom = null;

        if (blocks.length > 1 && lastBlockHasRoom) {
            const sharedRoomMatch = blocks[blocks.length - 1].match(/\(([^)]+)\)$/);
            sharedRoom = sharedRoomMatch ? sharedRoomMatch[1] : null;
        }

        for (let i = 0; i < blocks.length; i++) {
            let part = blocks[i];
            let room = null;
            let match;

            // 강의실이 각 블럭에 있는 경우
            match = part.match(/([가-힣]+)([\d,]+)\(([^)]+)\)/);
            if (match) {
                const day = match[1];
                const times = match[2].split(',').map(Number);
                room = match[3];
                result.push({
                    course_code,
                    course_name,
                    org_time,
                    professor,
                    course_room: room,
                    day,
                    start: Math.min(...times),
                    end: Math.max(...times),
                });
            } else {
                // 강의실이 공유된 경우 (마지막 블럭만 붙음)
                match = part.match(/([가-힣]+)([\d,]+)/);
                if (match && sharedRoom) {
                    const day = match[1];
                    const times = match[2].split(',').map(Number);
                    result.push({
                        course_code,
                        course_name,
                        org_time,
                        professor,
                        course_room: sharedRoom,
                        day,
                        start: Math.min(...times),
                        end: Math.max(...times),
                    });
                }
            }
        }
    }

    return result;
}

function handleParse(inputText, setCourseList) {
    const result = parseCourseList(inputText);
    setCourseList(result);
};

// isChecked가 true일 때, 렌더링 되는 부분
function renderContentTrue(sheetRef, isOpen, toggleSheet, classname, setClassname, courseList, setCourseList, isReset, setIsReset, classnameState, classList, error) {
    return (
        <div ref={sheetRef} className={`bottom-sheet ${isOpen ? "open" : ""}`}>
            <div className="sheet-header" onClick={toggleSheet}>
                <p>과목 검색하기</p>
            </div>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <TextField
                    variant="outlined"
                    placeholder="과목명을 입력하세요"
                    value={classname}
                    onChange={(e) => setClassname(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon style={{ color: '#555' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            backgroundColor: '#f2f2f2',
                            borderRadius: '24px',
                            paddingY: '2px',
                            paddingX: '8px',
                        },
                    }}
                    sx={{
                        width: '90%',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '24px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                        input: {
                            fontFamily: 'NanumSquare, Roboto, sans-serif',
                            fontWeight: 500,
                        },
                    }}
                />
            </Box>
            <div className="sheet-content">
                <ul>
                    <BottomSheetManager courseList={courseList} setCourseList={setCourseList} classList={classList ?? []} isReset={isReset} setIsReset={setIsReset} state={classnameState} error={error}></BottomSheetManager>
                </ul>
            </div>
        </div>
    );
}
// isChecked가 false일 때, 렌더링 되는 부분
function renderContentFalse(sheetRef, isOpen, toggleSheet, inputText, setInputText, courseList, setCourseList, setIsOpen) {
    return (
        <div ref={sheetRef} className={`bottom-sheet ${isOpen ? "open" : ""}`}>
            <div className="sheet-header" onClick={toggleSheet}>
                <a href="https://webinfo.dankook.ac.kr/tiac/univ/lssn/tcam/views/findTkcrsAplCfm.do?_view=ok" target="_blank" rel="noopener noreferrer">시간표 한번에 등록하기</a>
            </div>
            <Box sx={{ maxHeight: '60vh', overflowY: 'auto', px: 2, pt: 2, pb: 4 }}>
                <TextField
                    label="강의 데이터 입력"
                    placeholder="여기에 강의 정보를 붙여넣으세요"
                    multiline
                    minRows={10}
                    fullWidth
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                {inputText ? <Button
                    variant="contained"
                    onClick={() => {
                        handleParse(inputText, setCourseList);
                        setIsOpen(false);
                    }}
                    sx={{ mb: 2 }}
                >
                    제출
                </Button> :
                    <Button
                        variant="contained"
                        sx={{ mb: 2 }}
                        disabled
                    >
                        제출
                    </Button>}

                <Typography variant="h6" gutterBottom>
                    팝업창 상단의 링크 클릭 후, 표의 헤더(속성) 부분을 제외하고 복사 후 붙여넣기.
                </Typography>
                <Typography variant="h6" gutterBottom>
                    {"예시)"}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    1	죽전	540640	3	SW아카데믹영작	2	범용이수7	스튜어트존스	월19,20(인문403)【영어】	원격수업
                </Typography>
                <Typography variant="h6" gutterBottom>
                    2	죽전	339170	2	멀티미디어시스템	3	전공선택	윤원중	금11,12,13,14,15,16(소프트516)	원격수업
                </Typography>
                <Typography variant="h6" gutterBottom>
                    3	죽전	549370	2	자료구조	3	전공필수	강필성	수15,16,17,18,19(소프트305)	대면수업
                </Typography>
                <Typography variant="h6" gutterBottom>
                    4	죽전	558040	3	오픈소스SW기초	3	POSE-AI(Open Source)	송인식	수1,2,3,4,5,6(소프트516)	대면수업
                </Typography>
                <Typography variant="h6" gutterBottom>
                    5	죽전	329810	1	데이터베이스	3	전공선택	박소현	화4,5,6/목4,5,6(소프트517)	대면수업
                </Typography>
                <Typography variant="h6" gutterBottom>
                    6	죽전	418520	5	컴퓨터구조	3	전공필수	강필성	화12,13,14(소프트305)/목12,13,14(소프트332)	대면수업
                </Typography>
            </Box>
        </div>
    )
}

export default function BottomSheet({ courseList, setCourseList, isReset, setIsReset, isChecked }) {

    const [classname, setClassname] = useState('');
    const [classList, setClassList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [classnameState, setClassnameState] = useState(0);
    const [inputText, setInputText] = useState('');
    const sheetRef = useRef(null);

    // BottomSheet의 바깥을 클릭 or 터치했을 때, BottomSheet의 상태에 따른 처리
    const handleClickOutside = (event) => {
        if (!isChecked) return;
        if (sheetRef.current && !sheetRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        if (isChecked) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
                document.removeEventListener("touchstart", handleClickOutside);
            };
        }
        else setIsOpen(true);
    }, [isChecked]);
    // BottomSheet 헤더 부분 동작
    const toggleSheet = () => {
        if (!isChecked) return;
        setIsOpen(!isOpen);
    };

    // 검색 결과 fetch
    useEffect(() => {
        const fetchData = async () => {
            if (!classname.trim()) {
                setClassList(null);  // 검색어가 비어있으면 결과 초기화
                setClassnameState(0);
                return;
            }

            setLoading(true);
            setError(null);
            setClassnameState(1);

            try {
                const data = await fetchClassList(classname.replace(/\s+/g, '')); // 공백은 없는셈 친다.
                setClassList(data);
                setClassnameState(3);
            } catch (err) {
                setError("강의 정보를 불러오는 중 오류가 발생했습니다.");
                setClassnameState(2);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

    }, [classname]); // classname이 변경될 때마다 실행


    if (isChecked) return renderContentTrue(sheetRef, isOpen, toggleSheet, classname, setClassname, courseList, setCourseList, isReset, setIsReset, classnameState, classList, error);
    else return renderContentFalse(sheetRef, isOpen, toggleSheet, inputText, setInputText, courseList, setCourseList, setIsOpen);

} 
