import { useState } from "react";

import Offcanvas from "react-bootstrap/Offcanvas";
import Stack from "react-bootstrap/Stack";
import CardGroup from "react-bootstrap/CardGroup";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import ClassCard from "./ClassCard.js";

import styles from '../styles/ClassroomInfo.module.css';

function ClassroomInfo({ classroom, onHide }) {
    // TODO: API 호출
    const [classes, setClasses] = useState([]);

    return (
        <Offcanvas
            show={classroom}
            placement="bottom"
            backdrop={false}
            onHide={onHide}
        >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>✅ {classroom} 강의실 정보</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className={[styles.ColumnFlex, styles.NoPaddingTop, styles.DelegatePaddingX1]}>
                <section className={[styles.ColumnFlex, styles.FlexGrow1, styles.DelegatePaddingX1].join(' ')}>
                    <h6>오늘 수업</h6>
                    {classes.length > 0
                        ? <Stack
                            direction="horizontal"
                            gap={2}
                            as="ul"
                            className={[styles.NoStyleList, styles.VerticalList, styles.FlexGrow1, styles.PaddingX1, styles.NoMarginBottom]}
                        >
                            {classes.map((cls) => <ClassCard key={cls.start} classInfo={cls} />)}
                        </Stack>
                        : <div className={[styles.Center, styles.FlexGrow1].join(' ')}>오늘 예정된 수업이 없습니다.</div>
                    }
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
        </Offcanvas>
    );
}

export default ClassroomInfo;