import { useState, useMemo, useEffect, useTransition } from 'react';
import { getTime, getWeekday, periodStart } from '../utils/time.js';
import { fetchCoursesFromClassroom } from '../api.js';

import Card from 'react-bootstrap/Card';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

import styles from '../styles/ClassroomButton.module.css';

function ClassroomButton({ active, classroom, building, onClick, startTime }) {
    if(!startTime) startTime = getTime();

    const today = getWeekday();
    const [isLoading, startTransition] = useTransition();
    const [classes, setClasses] = useState([]);
    const todayClasses = useMemo(
        () => classes?.filter((cls) => cls.day === today).sort((cls) => cls.start),
        [classes, today]
    );
    const nextClass = useMemo(
        () =>
            !isLoading && todayClasses
                ?.filter((cls) => periodStart(cls.start) > startTime)
                .sort((a, b) => a.start - b.start)[0],
        [isLoading, startTime, todayClasses]
    );

    useEffect(() => {
        if(!classroom || !building) {
            return;
        };

        let dismiss = false;
        const { promise: dismissPromise, resolve: dismissPromiseResolve } =
            Promise.withResolvers();

        startTransition(
            async () =>
                await Promise.race([
                    fetchCoursesFromClassroom(
                        building,
                        classroom.slice(building.length)
                    ).then((classes) => !dismiss && setClasses(classes)),
                    dismissPromise,
                ])
        );

        return () => {
            dismiss = true;
            dismissPromiseResolve('dismissed');
        };
    }, [building, classroom]);

    return (
        <ListGroupItem
            className={styles.ClassroomButton}
            active={active}
            action
            onClick={() => onClick(classroom)}
        >
            <Card.Body>
                <Card.Title>{classroom}</Card.Title>
                <Card.Text>
                    {nextClass ? (
                        <>
                            <time>{periodStart(nextClass.start)}</time>까지 비어 있음
                        </>
                    ) : (
                        '비어 있음'
                    )}
                </Card.Text>
            </Card.Body>
        </ListGroupItem>
    );
}

export default ClassroomButton;
