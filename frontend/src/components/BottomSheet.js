import React, { useState, useEffect, useRef } from "react";
import { fetchClassList } from '../api';
import "../styles/BottomSheet.css"; // CSS 별도 정의

export default function BottomSheet({ course, setCourse }) {

    const [classname, setClassname] = useState('');
    const [classList, setClassList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const sheetRef = useRef(null);

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

    useEffect(() => { // classname이 변경될 때마다 실행
        const fetchData = async () => {
            if (!classname.trim()) {
                setClassList(null);  // 검색어가 비어있으면 결과 초기화
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const data = await fetchClassList(classname);
                setClassList(data);
            } catch (err) {
                setError("강의 정보를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [classname]);

    const toggleSheet = () => {
        setIsOpen(!isOpen);
    };

    const handleAddClass = (list) => { setCourse((prev) => [...prev, list]); };

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
            return classList.map((course, index) => (
                <div key={index} className="course-item">
                    <li>
                        {course.course_name} ({course.org_time}) - {course.professor}
                    </li>
                    <button onClick={() => handleAddClass(course)}>추가</button>
                </div>
            ));
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
            <div className="sheet-content">
                <input type="text" placeholder="강의 이름 입력" value={classname} onChange={(e) => setClassname(e.target.value)} />
                <ul>
                    {renderContent()}
                </ul>
            </div>
        </div>
    );
}
