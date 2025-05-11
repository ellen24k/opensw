import { useState } from "react";

import Offcanvas from "react-bootstrap/Offcanvas";
import Stack from "react-bootstrap/Stack";
import CardGroup from "react-bootstrap/CardGroup";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import ClassCard from "./ClassCard.js";

import styles from '../styles/ClassroomInfo.module.css';

function ClassroomInfo({ classroom, onHide }) {
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
            <Offcanvas.Body className={[styles.NoTopPadding, styles.DelegateXPadding1]}>
                <section className={styles.DelegateXPadding1}>
                    <h6>오늘 수업</h6>
                    <Stack
                        direction="horizontal"
                        gap={2}
                        as="ul"
                        className={[styles.NoStyleList, styles.VerticalList, styles.XPadding1]}
                    >
                        {classes.map((cls) => <ClassCard classInfo={cls} />)}
                    </Stack>
                </section>
                <section>
                    <Button className={styles.FullWidth} as={Link} to="/ViewClassSchedulePage">{classroom} 주간 시간표</Button>
                </section>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default ClassroomInfo;