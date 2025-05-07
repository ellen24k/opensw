import { Table, TableRow, TableHead, TableCell } from '@mui/material'
// import styles from '../styles/GanttChart.module.css'

const dayHeader = [" ", "월", "화", "수", "목", "금", "토"]
const hourHeader = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]

/* 각 시간에 대응하는 key-value 배열 생성
   [
     {"9": [courseObject1, "", "", "", "", ""]},
     {"10": [557950, "", "", "", "", ""]},
     {"11": [557950, "", "", "", "", ""]},
     {"12": ["", "", "", "", "", ""]} <- 기본값
     ...
     value를 순회할 때 Object이면 courseObject1의 start와 end의 차이만큼 rowspan 설정하고 course_name과 professor를 TableCell에 출력
     단순 course_code이면 TableCell 생성하지 않는다.
     ""이면 TableCell을 생성하되 children은 아무것도 넘기지 않는다.
   ] */

/* start부터 end를 우선 표준 시간으로 변경
   -> 조회된 모든 강의 Object 순회
   -> 각 강의 Object의 range(start, end)에 대응하는 key의 value에 강의 Object를 채운다.
   -> 단 value에 실질적인 강의 정보가 들어가는 건 key가 start일 때이며, 그 외의 범위는 course_code로만 채운다.
   -> 이 때 각 value의 index는 어떻게 결정하느냐? "day"에 해당하는 index로 판단한다.
   -> {"월": 0, "화": 1, "수": 2, "목": 3, "금": 4, "토": 5}: Lookup 테이블로 활용한다.
   -> 
*/

function GanttChart() {
    return (
        <Table >
            <TableRow >
                {dayHeader.map((day, index) => {
                    return <TableCell align="center">{day}</TableCell>
                })}
            </TableRow >
            {hourHeader.map((hour, index) => {
                return (
                    <TableRow>
                        <TableCell>{hour}</TableCell>
                    </TableRow>
                )
            })}
        </Table >
    )
}

export default GanttChart