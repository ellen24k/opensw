import { useMemo } from 'react';

import Selection from './Selection';
import { getWeekday } from '../utils/time';

const weekdays = ['월', '화', '수', '목', '금'];

function WeekdayFilter({ selected, onChange }) {
    const today = getWeekday();
    const isWeekday = weekdays.includes(today);

    return (
        <Selection
            title="요일"
            items={weekdays}
            selected={selected}
            highlighted={[today]}
            dropdown={false}
            onSelect={onChange}
        />
    );
}

export default WeekdayFilter;
