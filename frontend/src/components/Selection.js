import { useMemo } from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Stack from 'react-bootstrap/Stack';

import styles from '../styles/Selection.module.css';

function Selection({ title, items, selected, onChange, itemPostfix }) {
    const selectedSet = useMemo(() => new Set(selected), [selected]);

    function toggleItem(item) {
        onChange([...selectedSet.symmetricDifference(new Set([item]))]);
    }

    return (
        <Stack direction="horizontal" gap={1} className={styles.SelectionXScroll}>
            <Dropdown>
                <Dropdown.Toggle variant="secondary" className={styles.Selection}>
                    {title}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {items.map((item) => (
                        <Dropdown.Item key={item} onClick={() => toggleItem(item)} className={styles.LargeDropdownItem}>
                            <Stack
                                direction="horizontal"
                                gap={2}
                                className={styles.JustifyContentSpaceBetween}
                            >
                                {' '}
                                <div>
                                    {item}
                                    {itemPostfix}
                                </div>
                                {selectedSet.has(item) && <div>✅</div>}
                            </Stack>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            {selected.map((item) => (
                <ToggleButton
                    type="checkbox"
                    checked
                    key={item}
                    className={styles.Item}
                    onClick={() => toggleItem(item)}
                >
                    {item}
                    {itemPostfix}
                </ToggleButton>
            ))}
        </Stack>
    );
}

export default Selection;
