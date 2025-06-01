import { useEffect, useState, useTransition, useMemo } from 'react';
import { fetchCoursesFromClassroom } from '../api.js';
import { getWeekday } from '../utils/time.js';

import Offcanvas from 'react-bootstrap/Offcanvas';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import ClassCard from './ClassCard.js';

import styles from '../styles/ClassroomInfo.module.css';

function ClassroomInfo({ building, classroom, today = getWeekday(), onHide }) {
    const [isLoading, startTransition] = useTransition();
    const [classes, setClasses] = useState([]);
    const todayClasses = useMemo(
        () => classes?.filter((cls) => cls.day === today && cls.course_room === classroom).sort((a, b) => a.start - b.start),
        [classroom, classes, today]
    );

    useEffect(() => {
        if(!classroom || !building) {
            onHide();
            return;
        }

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
    }, [building, classroom, onHide]);

    return (
        <Offcanvas
            show={classroom && building}
            placement="bottom"
            backdrop={false}
            onHide={onHide}
            className={[styles.HeightFitContent, styles.MinHeight18]}
        >
            {classroom && building && (
                <>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>✅ {classroom} 강의실 정보</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body
                        className={[
                            styles.ColumnFlex,
                            styles.NoPaddingTop,
                            styles.DelegatePaddingX1,
                        ]}
                    >
                        <section
                            className={[
                                styles.ColumnFlex,
                                styles.FlexGrow1,
                                styles.DelegatePaddingX1,
                            ].join(' ')}
                        >
                            <h6>오늘 수업</h6>
                            {isLoading ? (
                                <div
                                    className={[
                                        styles.Center,
                                        styles.FlexGrow1,
                                    ].join(' ')}
                                >
                                    잠시만 기다려 주세요...
                                </div>
                            ) : todayClasses && todayClasses.length > 0 ? (
                                <Stack
                                    direction="horizontal"
                                    gap={2}
                                    as="ul"
                                    className={[
                                        styles.NoStyleList,
                                        styles.VerticalList,
                                        styles.FlexGrow1,
                                        styles.PaddingX1,
                                        styles.NoMarginBottom,
                                        styles.StretchItems
                                    ]}
                                >
                                    {todayClasses.map((cls) => (
                                        <ClassCard key={cls.start} classInfo={cls} />
                                    ))}
                                </Stack>
                            ) : (
                                <div
                                    className={[
                                        styles.Center,
                                        styles.FlexGrow1,
                                    ].join(' ')}
                                >
                                    오늘 예정된 수업이 없습니다.
                                </div>
                            )}
                        </section>
                        <section>
                            <Button
                                className={[styles.FullWidth, styles.MarginTop1]}
                                as={Link}
                                to={`/ViewClassSchedulePage/${classroom}`}
                            >
                                주간 시간표 보기
                            </Button>
                        </section>
                    </Offcanvas.Body>
                </>
            )}
        </Offcanvas>
    );
}

export default ClassroomInfo;
