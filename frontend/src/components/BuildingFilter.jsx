import { use, useMemo } from 'react';
import { fetchBuildingList } from '../api';

import Selection from './Selection';

function BuildingFilter({ selected, onChange }) {
    const buildings = use(useMemo(() => fetchBuildingList(), []));

    return (
        <Selection title="건물" items={buildings} selected={selected} onChange={onChange} />
    );
}

export default BuildingFilter;
