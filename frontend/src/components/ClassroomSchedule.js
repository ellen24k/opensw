// src/components/ClassroomSchedule.js
import React, { useState } from 'react';
import { fetchClassroomSchedule } from '../api';

const ClassroomSchedule = () => {
    const [classroomId, setClassroomId] = useState('');
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchSchedule = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchClassroomSchedule(classroomId);
            setSchedule(data);
        } catch (err) {
            setError('강의실 정보를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>강의실 시간표 조회</h1>
            <input
                type="text"
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                placeholder="강의실을 입력하세요 (소프트516)"
            />
            <button onClick={handleFetchSchedule} disabled={loading}>
                조회
            </button>
            {loading && <p>로딩 중...</p>}
            {error && <p>{error}</p>}
            {schedule && (
                <div>
                    <h2>{schedule.classroom} 시간표</h2>
                    <ul>
                        {schedule.schedule.courses.map((course, index) => (
                            <li key={index}>
                                {course.course_name} ({course.org_time}) - {course.professor}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ClassroomSchedule;