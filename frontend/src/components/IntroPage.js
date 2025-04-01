import MainFrame from "./MainFrame.js"
import ClassroomSchedule from "./ClassroomSchedule.js"
import NaviBar from "./NaviBar.js"
import { useState } from "react";

function IntroPage() {
    const [selectedOptionId, setSelectedOptionId] = useState(0);

    return (
        <MainFrame>
            <NaviBar selectedOptionId={selectedOptionId}></NaviBar>
        </MainFrame>
    )
}

export default IntroPage;