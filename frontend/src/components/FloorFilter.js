import { useMemo } from 'react';

import Selection from './Selection';

function FloorFilter({ building, classrooms, selected, onChange }) {
    console.log(building, classrooms);

    const floors = useMemo(
        () =>
            building && [
                ...new Set(
                    classrooms?.map((classroom) =>
                        classroom.slice(building.length).slice(0, 1)
                    )
                ),
            ],
        [building, classrooms]
    );

    if(!building) return null;

    return (
        <Selection
            title="층"
            items={floors}
            itemPostfix="층"
            selected={selected}
            dropdown={false}
            onChange={onChange}
        />
    );
}

export default FloorFilter;
