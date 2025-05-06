/* 기능: 강의실 시간표 */

import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import { Button } from "@mui/material";

function ViewClassSchedulePage() {
    return (
        <MainFrame>
            <NaviBar />
            <Button variant="contained">Test</Button>
        </MainFrame>
    )
}

export default ViewClassSchedulePage;