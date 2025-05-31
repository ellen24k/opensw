/**
 * 누적 분을 시간:분 문자열로 변환
 * @param {number} minutes 누적 분
 * @returns {string} 시:분
 */
export function minutesToTime(minutes) {
    const hour = Math.floor(minutes / 60)
        .toString()
        .padStart(2, '0');
    const minute = (minutes % 60).toString().padStart(2, '0');
    return `${hour}:${minute}`;
}

/**
 * 교시 시작 시간 계산
 * @param {number} period 교시 (정수 1~24)
 * @returns {string} 교시 시작 시간 (시:분)
 */
export function periodStart(period) {
    if (period <= 0) period = 1;
    if (period > 24) return "23:25";
    //throw new TypeError(`${period}교시는 존재하지 않습니다`);

    if (period <= 18) {
        return minutesToTime(9 * 60 + (period - 1) * 30);
    } else {
        return minutesToTime(18 * 60 + (period - 19) * 55);
    }
}

/**
 * 교시 종료 시간 계산
 * @param {number} period 교시 (정수 1~24)
 * @returns {string} 교시 시작 시간 (시:분)
 */
export function periodEnd(period) {
    if (period <= 0) period = 1;
    if (period > 24) return "23:59";
    //throw new TypeError(`${period}교시는 존재하지 않습니다`);

    if (period <= 18) {
        return minutesToTime(9 * 60 + period * 30);
    } else {
        return minutesToTime(18 * 60 + (period - 18) * 55 - 5);
    }
}

/**
 * 시작 시각을 교시로 환산
 * @param {number} minutes 누적 분
 * @returns {number} 교시 (실수) - 내림 시 시작한 마지막 교시, 올림 시 시작하지 않은 다음 교시
 */
export function startTimeToPeriod(minutes) {
    if (minutes < 0 || minutes > 24 * 60)
        throw new TypeError(
            `${minutes}(${minutesToTime(minutes)})는 유효하지 않은 시각입니다`
        );

    if (minutes < 9 * 60) return 0.5;
    else if (minutes < 18 * 60) return (minutes - 9 * 60) / 30 + 1;
    else if (minutes < 23 * 60 + 25)
        return (minutes - 18 * 60) / 55 + 19;
    else return 24.5;
}

/**
 * 끝 시각을 교시로 환산
 * @param {number} minutes 누적 분
 * @returns {number} 교시 (실수) - 내림 시 끝난 마지막 교시, 올림 시 끝나지 않은 다음 교시
 */
export function endTimeToPeriod(minutes) {
    if (minutes < 0 || minutes > 24 * 60)
        throw new TypeError(
            `${minutes}(${minutesToTime(minutes)})는 유효하지 않은 시각입니다`
        );

    if (minutes <= 9 * 60) return 0.5;
    else if (minutes <= 18 * 60) return (minutes - 9 * 60) / 30;
    else if (minutes <= 23 * 60 + 25)
        return (minutes - 18 * 60 + 5) / 55 + 18;
    else return 24.5;
}

/**
 * 교시 시작-종료 시간
 * @param {number} period 교시 (정수 1~24)
 * @returns {[string, string]} [시작 시간, 종료 시간] (시간=시:분)
 */
export function periodRange(period) {
    if (period <= 0 || period > 24)
        throw new TypeError(`${period}교시는 존재하지 않습니다`);

    return [periodStart(period), periodEnd(period)];
}

/**
 * 교시로 수업 시작-종료 시간 얻기
 * @param {number} start 시작 교시 (정수 1~24)
 * @param {number} end 종료 교시 (정수 1~24)
 * @returns {[string, string]} [시작 시간, 종료 시간] (시간=시:분)
 */
export function classTime(start, end) {
    return [periodStart(start), periodEnd(end)];
}

/**
 * 시:분 문자열을 누적 분으로 변환
 * @param {string} time 시:분 문자열
 * @returns {number} 누적 분
 */
export function timeToMinutes(time) {
    const [hours, minutes] = time.split(':');
    return Number(hours) * 60 + Number(minutes);
}

/**
 * 두 시각 사이의 교시
 * @param {string} start 시작 시각
 * @param {string} end 끝 시각
 * @returns {number[]} 두 시각 사이의 교시 배열
 */
export function periodsBetween(start, end) {
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);

    if (start < 0 || start > 24 * 60)
        throw new TypeError(`시작 시각(${start})이 유효하지 않습니다`);
    if (end < 0 || end > 24 * 60)
        throw new TypeError(`끝 시각(${end})이 유효하지 않습니다`);

    const startPeriod =
        (Math.floor(startTimeToPeriod(startMinutes)) + Math.floor(endTimeToPeriod(startMinutes))) / 2 + 0.5;
    const endPeriod = (Math.ceil(startTimeToPeriod(endMinutes)) + Math.ceil(endTimeToPeriod(endMinutes))) / 2 - 0.5;

    const periods = [];

    for (let i = Math.ceil(startPeriod); i <= endPeriod; i++) {
        periods.push(i);
    }

    return periods;
}

const weekdayFormatter = new Intl.DateTimeFormat('ko-KR', { weekday: 'short' });
/**
 * 오늘 요일 얻기
 * @returns {string} 오늘 요일 (1글자)
 */
export function getWeekday() {
    return weekdayFormatter.format();
}

/**
 * 현재 시간 얻기
 * @returns {string} 현재 시각 (시:분)
 */
export function getTime() {
    const date = new Date();
    return `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
}

/**
 * n분 후 시간 얻기
 * @param {number} minutes n분
 * @returns {string} n분 후 시각 (시:분)
 */
export function getTimeAfter(minutes) {
    const date = new Date();
    let after = date.getHours() * 60 + date.getMinutes() + minutes;
    if (after > 24 * 60) after -= 24 * 60;
    return minutesToTime(after);
}
