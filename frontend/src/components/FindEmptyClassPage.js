/* 기능: 빈 강의실 */

import { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import ClassroomFilter from './ClassroomFilter.js';
import ClassroomButton from './ClassroomButton.js';
import ClassroomInfo from './ClassroomInfo.js';

import styles from '../styles/FindEmptyClassPage.module.css';

function FindEmptyClassPage() {
    const [emptyClassrooms, setEmptyClassrooms] = useState(['소프트332', '2공524']);
    const [activeClassroom, setActiveClassroom] = useState(null);
    return (
        <MainFrame>
            <NaviBar />
            <ClassroomFilter onChange={(classrooms) => { }} />
            <ListGroup className={styles.Gap05}>
                {emptyClassrooms.map((classroom) => (
                    <ClassroomButton
                        key={classroom}
                        classroom={classroom}
                        classes={[]}
                        active={activeClassroom === classroom}
                        onClick={(classroom) => {
                            setActiveClassroom(activeClassroom === classroom ? null : classroom);
                        }}
                    />
                ))}
            </ListGroup>
            <ClassroomInfo
                classroom={activeClassroom}
                onHide={() => setActiveClassroom(null)}
            />
        </MainFrame >
    );
}

export default FindEmptyClassPage;