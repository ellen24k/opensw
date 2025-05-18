/* 기능: 빈 강의실 */

import { useState, useMemo, Suspense, useTransition } from 'react';
import {
    endTimeToPeriod,
    getTime,
    getTimeAfter,
    getWeekday,
    minutesToTime,
    periodEnd,
    periodsBetween,
    timeToMinutes,
} from '../utils/time.js';
import { fetchEmptyClassroomInBuilding } from '../api.js';

import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import MainFrame from './MainFrame.js';
import NaviBar from './NaviBar.js';
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
    const [selectedEndTime, setSelectedEndTime] = useState(() =>
        periodEnd(Math.ceil(endTimeToPeriod(timeToMinutes(currentTime)) + 0.5))
    );
    const [selectedBuildings, setSelectedBuildings] = useState([]);
    const [selectedFloors, setSelectedFloors] = useState([]);

    const selectedPeriods = useMemo(
        () => periodsBetween(selectedStartTime, selectedEndTime),
        [selectedStartTime, selectedEndTime]
    );

    const periodFilteredClassrooms = useMemo(() => {
        if(selectedPeriods.length === 0) return [];
        else {
            return selectedBuildings.flatMap((building) => {
                const periodResults = emptyClassrooms[building];
                if(periodResults)
                    return selectedPeriods
                        .map((period) => periodResults[period]['empty_classrooms'])
                        .reduce((a, b) => [...new Set(a).intersection(new Set(b))]);
                else return [];
            });
        }
    }, [emptyClassrooms, selectedPeriods, selectedBuildings]);

    const floorFilteredClassrooms = useMemo(() => {
        if(selectedBuildings.length !== 1 || selectedFloors.length === 0)
            return periodFilteredClassrooms;
        else {
            const selectedBuilding = selectedBuildings[0];
            return periodFilteredClassrooms.filter((classroom) =>
                selectedFloors.some((floor) =>
                    classroom.startsWith(selectedBuilding + floor)
                )
            );
        }
    }, [periodFilteredClassrooms, selectedBuildings, selectedFloors]);

    return (
        <MainFrame>
            <NaviBar />
            {today === '토' || today === '일' ? (
                <Alert className={[styles.MarginTop05, styles.Center]}>
                    평일에만 이용할 수 있습니다.
                </Alert>
            ) : (
                <Stack gap={2} className={styles.MarginTop05}>
                    <TimeFilter
                        start={selectedStartTime}
                        end={selectedEndTime}
                        onStartChange={(start) => setSelectedStartTime(start)}
                        onEndChange={(end) => setSelectedEndTime(end)}
                    />
                    <Suspense
                        fallback={<div className={styles.Center}>로딩 중...</div>}
                    >
                        <BuildingFilter
                            selected={selectedBuildings}
                            onChange={(selected) => {
                                setSelectedBuildings(selected);
                                setSelectedFloors([]);
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
                    {selectedStartTime > selectedEndTime && (
                        <Alert variant="danger">
                            종료 시간이 시작 시간보다 빠릅니다. 선택한 시간을 다시
                            확인해 주세요.
                        </Alert>
                    )}
                    {isLoading && <div className={styles.Center}>로딩중...</div>}
                    {selectedBuildings.length > 0 ? (
                        <>
                            <ListGroup className={[styles.Gap05, styles.Grid2Col]}>
                                {floorFilteredClassrooms.map((classroom) => (
                                    <ClassroomButton
                                        key={classroom}
                                        building={selectedBuildings.find(
                                            (building) =>
                                                classroom.startsWith(building)
                                        )}
                                        classroom={classroom}
                                        startTime={selectedStartTime}
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
                            <Alert variant="secondary" className={styles.Center}>
                                <Alert.Heading as="h6">
                                    마음에 드는 강의실이 없으시나요?
                                </Alert.Heading>
                                <Button
                                    onClick={() =>
                                        setSelectedStartTime((selectedStartTime) =>
                                            minutesToTime(
                                                timeToMinutes(selectedStartTime) + 30
                                            )
                                        )
                                    }
                                >
                                    30분 뒤 사용 가능한 강의실 보기
                                </Button>
                            </Alert>
                        </>
                    ) : (
                        <Alert className={styles.Center}>
                            건물을 먼저 선택해 주세요.
                        </Alert>
                    )}
                    <ClassroomInfo
                        classroom={activeClassroom}
                        building={
                            activeClassroom &&
                            selectedBuildings.find((building) =>
                                activeClassroom.startsWith(building)
                            )
                        }
                        onHide={() => setActiveClassroom(null)}
                    />
                </Stack>
            )}
        </MainFrame>
    );
}

export default FindEmptyClassPage;
