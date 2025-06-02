import { useMemo } from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Stack from 'react-bootstrap/Stack';

import styles from '../styles/Selection.module.css';

function Selection({
    title,
    items,
    selected,
    dropdown = true,
    pinned,
    highlighted,
    onChange,
    onSelect,
    itemPostfix,
}) {
    const selectedSet = useMemo(() => new Set(selected), [selected]);
    const pinnedSet = useMemo(() => new Set(pinned ?? []), [pinned]);
    const showingSet = useMemo(
        () => new Set(dropdown ? [] : items).union(pinnedSet).union(selectedSet),
        [dropdown, items, pinnedSet, selectedSet]
    );

    function toggleItem(item) {
        onChange?.([...selectedSet.symmetricDifference(new Set([item]))]);
    }

    return (
        <Stack direction="horizontal" gap={1} className={styles.SelectionXScroll}>
            {dropdown && (
                <Dropdown autoClose="outside">
                    <Dropdown.Toggle
                        variant="secondary"
                        className={styles.Selection}
                    >
                        {title}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {items.map((item) => (
                            <Dropdown.Item
                                key={item}
                                onClick={() => toggleItem(item)}
                                className={styles.LargeDropdownItem}
                            >
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
            )}
            {[...showingSet].map((item) => (
                <ToggleButton
                    type="checkbox"
                    checked={selectedSet.has(item)}
                    variant={selectedSet.has(item) ? 'primary' : highlighted?.includes(item) ? 'outline-primary' : 'outline-secondary'}
                    key={item}
                    className={styles.Item}
                    onClick={() => (onSelect ? onSelect(item) : toggleItem(item))}
                >
                    {item}
                    {itemPostfix}
                </ToggleButton>
            ))}
        </Stack>
    );
}

export default Selection;
