import React, { useState, useEffect, useRef } from "react";
import { fetchClassList } from '../api';
import { BottomSheetManager } from "./BottomSheetManager";
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import "../styles/BottomSheet.css"; // CSS 별도 정의

export default function BottomSheet({ courseList, setCourseList, isReset, setIsReset }) {

    const [classname, setClassname] = useState('');
    const [classList, setClassList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const sheetRef = useRef(null);

    // BottomSheet의 바깥을 클릭 or 터치했을 때, BottomSheet의 상태에 따른 처리
    const handleClickOutside = (event) => {
        if (sheetRef.current && !sheetRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isOpen]);

    // BottomSheet 헤더 부분 동작
    const toggleSheet = () => {
        setIsOpen(!isOpen);
    };

    // 검색 결과 fetch
    useEffect(() => {
        const fetchData = async () => {
            if (!classname.trim()) {
                setClassList(null);  // 검색어가 비어있으면 결과 초기화
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const data = await fetchClassList(classname.replace(/\s+/g, '')); // 공백은 없는셈 친다.
                setClassList(data);
            } catch (err) {
                setError("강의 정보를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [classname]); // classname이 변경될 때마다 실행



    function renderContent() { // 절차에 따른 렌더링
        if (!classname.trim()) {
            return <p>강의 이름을 입력하세요.</p>;
        }
        if (loading) {
            return <p>로딩 중...</p>;
        }
        if (error) {
            return <p style={{ color: 'red' }}>{error}</p>;
        }
        if (classList && classList.length > 0) {
            return <BottomSheetManager courseList={courseList} setCourseList={setCourseList} classList={classList} isReset={isReset} setIsReset={setIsReset}></BottomSheetManager>;
        }
        if (classname.trim()) {
            return <p>검색 결과가 없습니다.</p>;
        }
        return null;
    }

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
                    {renderContent()}
                </ul>
            </div>
        </div>
    );
}
