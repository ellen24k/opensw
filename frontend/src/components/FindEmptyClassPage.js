/* 기능: 빈 강의실 */

import { useState } from 'react';

import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import ClassroomFilter from './ClassroomFilter.js';
import ClassroomButton from './ClassroomButton.js';
import ClassroomInfo from './ClassroomInfo.js';

function FindEmptyClassPage() {
    const [emptyClassrooms, setEmptyClassrooms] = useState([]);
    const [activeClassroom, setActiveClassroom] = useState(null);
    return (
        <MainFrame>
            <NaviBar />
            <ClassroomFilter />
            <ul>
                {emptyClassrooms.map((classroom) => (
                    <li><ClassroomButton
                        active={activeClassroom === classroom}
                        classroom={classroom}
                    /></li>
                ))}
            </ul>
            {(activeClassroom) && <ClassroomInfo classroom={activeClassroom} />}
        </MainFrame>
    );
}

export default FindEmptyClassPage;