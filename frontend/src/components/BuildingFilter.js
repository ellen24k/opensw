import { Fragment, use, useMemo } from 'react';
import { fetchBuildingList } from '../api';

import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';

import styles from '../styles/BuildingFilter.module.css';

function BuildingFilter({ selected, onChange }) {
    const buildings = use(useMemo(() => fetchBuildingList(), []));

    const selectedSet = useMemo(() => new Set(selected), [selected]);
    const unselected = useMemo(() => [...new Set(buildings).difference(selectedSet)], [buildings, selectedSet]);

    function toggleBuilding(building) {
        onChange([...selectedSet.symmetricDifference(new Set([building]))]);
    }

    return (
        <Card>
            <Card.Body className={styles.Buildings}>
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" className={styles.Button}>건물</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {' '}
                        {unselected.map((building) => (
                            <Dropdown.Item
                                key={building}
                                onClick={() => toggleBuilding(building)}
                            >
                                {building}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                {selected.map((building) => (
                    <div key={building}>
                        <ToggleButton type="checkbox" checked className={styles.Button} onClick={() => toggleBuilding(building)}>
                            {building}
                        </ToggleButton>
                    </div>
                ))}
            </Card.Body>
        </Card>
    );
}

export default BuildingFilter;
