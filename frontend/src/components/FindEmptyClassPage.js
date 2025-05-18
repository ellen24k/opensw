/* 기능: 빈 강의실 */

import { useState, useMemo, Suspense, useTransition } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import {
    getTime,
    getTimeAfter,
    getWeekday,
    periodsBetween,
} from '../utils/time.js';
import { fetchEmptyClassroomInBuilding } from '../api.js';

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
    const today = getWeekday();
    const currentTime = getTime();

    const [isLoading, startTransition] = useTransition();

    const [emptyClassrooms, setEmptyClassrooms] = useState({});
    const [activeClassroom, setActiveClassroom] = useState(null);

    const [selectedStartTime, setSelectedStartTime] = useState(currentTime);
    const [selectedEndTime, setSelectedEndTime] = useState(getTimeAfter(+30));
    const [selectedBuildings, setSelectedBuildings] = useState([]);
    const [selectedFloors, setSelectedFloors] = useState([]);

    const selectedPeriods = useMemo(
        () => periodsBetween(selectedStartTime, selectedEndTime),
        [selectedStartTime, selectedEndTime]
    );

    const periodFilteredClassrooms = useMemo(() => {
        if(isLoading || selectedPeriods.length === 0) return [];
        else {
            return selectedBuildings.flatMap((building) => {
                const periodResults = emptyClassrooms[building];
                console.log(emptyClassrooms, building, periodResults);
                return selectedPeriods
                    .map((period) => periodResults[period]['empty_classrooms'])
                    .reduce((a, b) => [...new Set(a).intersection(new Set(b))]);
            });
        }
    }, [isLoading, emptyClassrooms, selectedPeriods, selectedBuildings]);

    const floorFilteredClassrooms = useMemo(() => {
        if(isLoading) return [];
        else if(selectedBuildings.length !== 1 || selectedFloors.length === 0)
            return periodFilteredClassrooms;
        else {
            const selectedBuilding = selectedBuildings[0];
            // 건물이 하나만 선택되면 층 선택 가능, 건물+층으로 필터링
            return periodFilteredClassrooms.filter((classroom) =>
                selectedFloors.some((floor) =>
                    classroom.startsWith(selectedBuilding + floor)
                )
            );
        }
    }, [isLoading, periodFilteredClassrooms, selectedBuildings, selectedFloors]);

    return (
        <MainFrame>
            <NaviBar />
            {isLoading ? (
                <>로딩중...</>
            ) : today === '토' || today === '일' ? (
                <>평일에만 이용할 수 있습니다.</>
            ) : (
                <>
                    <ClassroomFilter>
                        <TimeFilter
                            start={selectedStartTime}
                            end={selectedEndTime}
                            onStartChange={(start) => setSelectedStartTime(start)}
                            onEndChange={(end) => setSelectedEndTime(end)}
                        />
                        <Suspense fallback={<>로딩 중...</>}>
                            <BuildingFilter
                                selected={selectedBuildings}
                                onChange={(selected) => {
                                    setSelectedBuildings(selected);
                                    startTransition(async () => {
                                        console.log('startTransition');
                                        const result = await Promise.all(
                                            selected
                                                .filter(
                                                    (building) =>
                                                        !emptyClassrooms[building]
                                                )
                                                .map((building) =>
                                                    (async () => {
                                                        const buildingClassrooms =
                                                            await fetchEmptyClassroomInBuilding(
                                                                building,
                                                                today
                                                            );
                                                        setEmptyClassrooms({
                                                            ...emptyClassrooms,
                                                            [building]:
                                                                buildingClassrooms[
                                                                'period_results'
                                                                ],
                                                        });
                                                        setSelectedFloors([]);
                                                        console.log(
                                                            building,
                                                            buildingClassrooms
                                                        );
                                                    })()
                                                )
                                        );
                                        console.log('endTransition', result.length);
                                    });
                                }}
                            />
                        </Suspense>
                        {selectedBuildings.length === 1 && (
                            <FloorFilter
                                building={selectedBuildings[0]}
                                classrooms={periodFilteredClassrooms}
                                selected={selectedFloors}
                                onChange={(selected) => setSelectedFloors(selected)}
                            />
                        )}
                    </ClassroomFilter>
                    <ListGroup className={styles.Gap05}>
                        {floorFilteredClassrooms.map((classroom) => (
                            <ClassroomButton
                                key={classroom}
                                classroom={classroom}
                                classes={[]}
                                active={activeClassroom === classroom}
                                onClick={(classroom) => {
                                    setActiveClassroom(
                                        activeClassroom === classroom
                                            ? null
                                            : classroom
                                    );
                                }}
                            />
                        ))}
                    </ListGroup>
                    <ClassroomInfo
                        classroom={activeClassroom}
                        onHide={() => setActiveClassroom(null)}
                    />
                </>
            )}
        </MainFrame>
    );
}

export default FindEmptyClassPage;
