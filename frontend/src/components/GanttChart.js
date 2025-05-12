import { Table, TableRow, TableHead, TableCell } from '@mui/material'
import { useState, useEffect } from 'react'
// import styles from '../styles/GanttChart.module.css'
import { purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, red, pink, grey, blueGrey } from '@mui/material/colors'

const dayHeader = [" ", "월", "화", "수", "목", "금", "토"]
const hourHeader = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
const colorMap = [purple[800], deepPurple[800], indigo[800], blue[800], lightBlue[800], cyan[800], teal[800], green[800], lightGreen[800], lime[800], yellow[800], amber[800], orange[800], deepOrange[800], red[800], pink[800], grey[800], blueGrey[800]]


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

const DAY_LUT = {
    "월": 0,
    "화": 1,
    "수": 2,
    "목": 3,
    "금": 4,
    "토": 5
}

const TableMap_ = [
    { 9: ["", "", "", "", "", ""] },
    { 9.5: ["", "", "", "", "", ""] },
    { 10: ["", "", "", "", "", ""] },
    { 10.5: ["", "", "", "", "", ""] },
    { 11: ["", "", "", "", "", ""] },
    { 11.5: ["", "", "", "", "", ""] },
    { 12: ["", "", "", "", "", ""] },
    { 12.5: ["", "", "", "", "", ""] },
    { 13: ["", "", "", "", "", ""] },
    { 13.5: ["", "", "", "", "", ""] },
    { 14: ["", "", "", "", "", ""] },
    { 14.5: ["", "", "", "", "", ""] },
    { 15: ["", "", "", "", "", ""] },
    { 15.5: ["", "", "", "", "", ""] },
    { 16: ["", "", "", "", "", ""] },
    { 16.5: ["", "", "", "", "", ""] },
    { 17: ["", "", "", "", "", ""] },
    { 17.5: ["", "", "", "", "", ""] },
    { 18: ["", "", "", "", "", ""] },
    { 18.5: ["", "", "", "", "", ""] },
    { 19: ["", "", "", "", "", ""] },
    { 19.5: ["", "", "", "", "", ""] },
    { 20: ["", "", "", "", "", ""] },
    { 20.5: ["", "", "", "", "", ""] },
    { 21: ["", "", "", "", "", ""] },
    { 21.5: ["", "", "", "", "", ""] },
    { 22: ["", "", "", "", "", ""] },
    { 22.5: ["", "", "", "", "", ""] },
]

function GanttChart({ courses }) {
    const [TableMap, setTableMap] = useState(TableMap_)

    useEffect(() => {
        if (courses == null) {

        } else {
            const newTableMap = [
                { 9: ["", "", "", "", "", ""] },
                { 9.5: ["", "", "", "", "", ""] },
                { 10: ["", "", "", "", "", ""] },
                { 10.5: ["", "", "", "", "", ""] },
                { 11: ["", "", "", "", "", ""] },
                { 11.5: ["", "", "", "", "", ""] },
                { 12: ["", "", "", "", "", ""] },
                { 12.5: ["", "", "", "", "", ""] },
                { 13: ["", "", "", "", "", ""] },
                { 13.5: ["", "", "", "", "", ""] },
                { 14: ["", "", "", "", "", ""] },
                { 14.5: ["", "", "", "", "", ""] },
                { 15: ["", "", "", "", "", ""] },
                { 15.5: ["", "", "", "", "", ""] },
                { 16: ["", "", "", "", "", ""] },
                { 16.5: ["", "", "", "", "", ""] },
                { 17: ["", "", "", "", "", ""] },
                { 17.5: ["", "", "", "", "", ""] },
                { 18: ["", "", "", "", "", ""] },
                { 18.5: ["", "", "", "", "", ""] },
                { 19: ["", "", "", "", "", ""] },
                { 19.5: ["", "", "", "", "", ""] },
                { 20: ["", "", "", "", "", ""] },
                { 20.5: ["", "", "", "", "", ""] },
                { 21: ["", "", "", "", "", ""] },
                { 21.5: ["", "", "", "", "", ""] },
                { 22: ["", "", "", "", "", ""] },
                { 22.5: ["", "", "", "", "", ""] },
            ]
            const normCourses = courses.map((courseObj, index) => {
                const start = courseObj["start"]
                const end = courseObj["end"]
                return { ...courseObj, "course_code": parseInt(courseObj["course_code"]), "start": (start - 1) * 0.5 + 9, "end": (end - 1) * 0.5 + 9 }
            })

            const uniqueCourseCodes = [...new Set(normCourses.map(courseObj => courseObj["course_code"]))]
            console.log(uniqueCourseCodes)

            // forEach는 배열을 반환하지 않고, 콜백 함수만 처리한다. courseObj는 레퍼런스이므로 원본 배열을 변경할 수 있다.
            uniqueCourseCodes.map((code, idx) => {
                normCourses.filter(courseObj => courseObj["course_code"] == code).forEach(courseObj => {
                    courseObj["color"] = colorMap[idx]
                })
            })

            console.log(normCourses)
            normCourses.forEach((courseObj) => {
                const courseCode = courseObj["course_code"]
                const courseName = courseObj["course_name"]
                const start = courseObj["start"]
                const end = courseObj["end"]
                const day = courseObj["day"]

                newTableMap[(start - 9) * 2][start][DAY_LUT[day]] = courseObj
                for (let i = start + 0.5; i <= end; i += 0.5) {
                    newTableMap[(i - 9) * 2][i][DAY_LUT[day]] = courseCode
                }
            })
            console.log(newTableMap)
            setTableMap(newTableMap)
        }

    }, [courses])

    return (
        <Table sx={{ borderCollapse: 'collapse', marginTop: "10px" }}>
            <TableHead>
                <TableRow>
                    {dayHeader.map((day, index) => {
                        return <TableCell key={index} align="center" sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{day}</TableCell>
                    })}
                </TableRow>
            </TableHead>

            {TableMap.map((row, idx_row) => {
                return (
                    <TableRow key={idx_row}>
                        {(idx_row % 2 == 0) && <TableCell rowSpan={2} sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{hourHeader[idx_row / 2]}</TableCell>}
                        {Object.values(row)[0].map((course, index) => {
                            if (course == "") {
                                return <TableCell key={index} sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }} />
                            } else if (typeof (course) == "object") {
                                return <TableCell
                                    key={index}
                                    sx={{
                                        backgroundColor: course.color,
                                        padding: "4px",
                                        color: "white",
                                        fontSize: "12px",
                                        fontFamily: "NanumSquare",
                                        width: "14%",
                                        border: "1px solid gray",
                                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                                        verticalAlign: "top"
                                    }} rowSpan={2 * (course.end - course.start + 0.5)}>
                                    {course.course_name}<br />
                                    P:{course.professor}
                                </TableCell>
                            } else if (typeof (course) == "number") {
                            }
                        })}
                    </TableRow>
                )
            })}
        </Table>
    )
}

export default GanttChart