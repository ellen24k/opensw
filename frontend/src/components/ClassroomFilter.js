import Stack from 'react-bootstrap/Stack';

import styles from '../styles/ClassroomFilter.module.css';

function ClassroomFilter({ children }) {
    return (
        <Stack gap={1} className={styles.MarginTop}>
            {children}
        </Stack>
    );
}

export default ClassroomFilter;
