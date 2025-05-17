/* 기능: 빈 강의실 */

import { useState, useMemo, Suspense } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

import MainFrame from './MainFrame.js';
import NaviBar from './NaviBar.js';
import ClassroomFilter from './ClassroomFilter.js';
import ClassroomButton from './ClassroomButton.js';
import ClassroomInfo from './ClassroomInfo.js';
import BuildingFilter from './BuildingFilter.js';
import FloorFilter from './FloorFilter.js';
import TimeFilter from './TimeFilter.js';

import styles from '../styles/FindEmptyClassPage.module.css';

function FindEmptyClassPage() {
    // TODO: API 호출
    const [emptyClassrooms, setEmptyClassrooms] = useState(['소프트332', '2공524']);
    const [activeClassroom, setActiveClassroom] = useState(null);

    const [selectedBuildings, setSelectedBuildings] = useState([]);
    const [selectedFloors, setSelectedFloors] = useState([]);

    const filteredClassrooms = useMemo(() => {
        if(selectedBuildings.length === 1) {
            const selectedBuilding = selectedBuildings[0];
            // 건물이 하나만 선택되면 층 선택 가능, 건물+층으로 필터링
            return emptyClassrooms.filter((classroom) =>
                selectedFloors.some((floor) =>
                    classroom.startsWith(selectedBuilding + floor)
                )
            );
        } else {
            // 건물이 여러 개 선택되면 층 선택 불가, 건물로 필터링
            return emptyClassrooms.filter((classroom) =>
                selectedBuildings.some((building) => classroom.startsWith(building))
            );
        }
    }, [emptyClassrooms, selectedBuildings, selectedFloors]);

    return (
        <MainFrame>
            <NaviBar />
            <Suspense fallback={<>로딩중...</>}>
                <ClassroomFilter onChange={(classrooms) => { }}>
                    <TimeFilter />
                    <BuildingFilter
                        selected={selectedBuildings}
                        onChange={(selected) => setSelectedBuildings(selected)}
                    />
                    {selectedBuildings.length === 1 && (
                        <FloorFilter
                            building={selectedBuildings[0]}
                            selected={selectedFloors}
                            onChange={(selected) => setSelectedFloors(selected)}
                        />
                    )}
                </ClassroomFilter>
            </Suspense>
            <ListGroup className={styles.Gap05}>
                {emptyClassrooms.map((classroom) => (
                    <ClassroomButton
                        key={classroom}
                        classroom={classroom}
                        classes={[]}
                        active={activeClassroom === classroom}
                        onClick={(classroom) => {
                            setActiveClassroom(
                                activeClassroom === classroom ? null : classroom
                            );
                        }}
                    />
                ))}
            </ListGroup>
            <ClassroomInfo
                classroom={activeClassroom}
                onHide={() => setActiveClassroom(null)}
            />
        </MainFrame>
    );
}

export default FindEmptyClassPage;
