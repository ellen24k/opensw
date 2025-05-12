import { classTime, periodStart } from '../util.js';

import Card from 'react-bootstrap/Card';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

import styles from '../styles/ClassroomButton.module.css';

function ClassroomButton({ active, classroom, onClick, classes }) {
    const currentTime = (date => `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`)(new Date());
    const nextClass = classes
        ?.filter(cls => periodStart(cls.start) > currentTime)
        ?.sort((a, b) => a.start - b.start)?.[0];

    return (
        <ListGroupItem
            className={styles.ClassroomButton}
            active={active}
            action
            onClick={() => onClick(classroom)}
        >
            <Card.Body>
                <Card.Title>{classroom}</Card.Title>
                <Card.Text>{
                    nextClass
                        ? (<><time>{periodStart(nextClass.start)}</time>까지 비어 있음</>)
                        : '비어 있음'
                }</Card.Text>
            </Card.Body>
        </ListGroupItem>
    );
}

export default ClassroomButton;