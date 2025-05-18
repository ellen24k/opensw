import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import styles from '../styles/TimeFIlter.module.css';

function TimeFilter({ start, end, onStartChange, onEndChange }) {
    return (
        <Stack direction="horizontal" gap={2}>
            <FloatingLabel label="시작 시간" className={styles.FlexGrow}>
                <Form.Control type="time" value={start} onChange={(event) => onStartChange(event.target.value)} />
            </FloatingLabel>
            ~
            <FloatingLabel label="종료 시간" className={styles.FlexGrow}>
                <Form.Control type="time" value={end} onChange={(event) => onEndChange(event.target.value)} />
            </FloatingLabel>
        </Stack>
    );
}

export default TimeFilter;
