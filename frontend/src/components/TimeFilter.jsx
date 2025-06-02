import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';

import styles from '../styles/TimeFIlter.module.css';

function TimeFilter({ start, end, onStartChange, onEndChange }) {
    return (
        <Stack direction="horizontal" gap={2}>
            <InputGroup size="sm">
                <FloatingLabel label="시작 시간" className={styles.FlexGrow}>
                    <Form.Control
                        type="time"
                        value={start}
                        onChange={(event) => onStartChange(event.target.value)}
                    />
                </FloatingLabel>
                <InputGroup.Text className={styles.HideXS}>부터</InputGroup.Text>
            </InputGroup>
            ~
            <InputGroup size="sm">
                <FloatingLabel label="종료 시간" className={styles.FlexGrow}>
                    <Form.Control
                        type="time"
                        value={end}
                        onChange={(event) => onEndChange(event.target.value)}
                    />
                </FloatingLabel>
                <InputGroup.Text className={styles.HideXS}>까지</InputGroup.Text>
            </InputGroup>
        </Stack>
    );
}

export default TimeFilter;
