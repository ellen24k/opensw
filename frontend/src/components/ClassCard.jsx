import { classTime } from '../utils/time.js';

import Card from 'react-bootstrap/Card';

import styles from '../styles/ClassCard.module.css';

function ClassCard({ classInfo }) {
    const [start, end] = classTime(classInfo.start, classInfo.end);

    return (
        <Card as="li" className={styles.ClassCard}>
            <Card.Body>
                <Card.Title>{classInfo.course_name}</Card.Title>
                <Card.Text as="div">
                    <div><time>{start}</time> ~ <time>{end}</time></div>
                    <div>{classInfo.professor}</div>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default ClassCard;