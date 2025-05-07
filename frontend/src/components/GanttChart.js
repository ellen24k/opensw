import { Table, TableRow, TableHead, TableCell } from '@mui/material'
// import styles from '../styles/GanttChart.module.css'

function GanttChart() {
    return (
        <Table >
            <TableRow >
                <TableCell >&nbsp;</TableCell >
                <TableCell align="center" >월</TableCell >
                <TableCell align="center" >화</TableCell >
                <TableCell align="center" >수</TableCell >
                <TableCell align="center" >목</TableCell >
                <TableCell align="center" >금</TableCell >
                <TableCell align="center" >토</TableCell >
            </TableRow >
            <TableRow >
                <TableCell >1</TableCell >
                <TableCell rowSpan={2} sx={{ backgroundColor: "red" }}></TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
            </TableRow >
            <TableRow >
                <TableCell >2</TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
            </TableRow  >
            <TableRow >
                <TableCell >3</TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
                <TableCell ></TableCell >
            </TableRow >

        </Table >
    )
}

export default GanttChart