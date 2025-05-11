/**
 * 누적 분을 시간:분 문자열로 변환
 * @param {number} minutes 누적 분
 * @returns {string} 시:분
 */
export function minutesToTime(minutes) {
    const hour = String(Math.floor(minutes / 60)).padStart(2, '0');
    const minute = String(minutes % 60).padStart(2, '0');
    return `${hour}:${minute}`;
}

/**
 * 교시 시작 시간 계산
 * @param {number} period 교시 (정수 1~24)
 * @returns {string} 교시 시작 시간 (시:분)
 */
export function periodStart(period) {
    if(period <= 0 || period > 24) throw new TypeError(`${period}교시는 존재하지 않습니다`);

    if(period <= 18) {
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
    if(period <= 0 || period > 24) throw new TypeError(`${period}교시는 존재하지 않습니다`);

    if(period <= 18) {
        return minutesToTime(9 * 60 + period * 30);
    } else {
        return minutesToTime(18 * 60 + (period - 18) * 55 - 5);
    }
}

/**
 * 교시 시작-종료 시간
 * @param {number} period 교시 (정수 1~24)
 * @returns {[string, string]} [시작 시간, 종료 시간] (시간=시:분)
 */
export function periodRange(period) {
    if(period <= 0 || period > 24) throw new TypeError(`${period}교시는 존재하지 않습니다`);

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