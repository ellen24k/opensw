/* 기능: 내 시간표 */

import MainFrame from "./MainFrame.js";
import NaviBar from "./NaviBar.js";
import { SelectedOptionIdSetterContext } from "./NaviContext.js";
import { useContext, useEffect } from "react";

function MySchedulePage() {
    const setSelectedOptionId = useContext(SelectedOptionIdSetterContext)
    useEffect(() => {
        setSelectedOptionId(2)
    }, [])

    return (
        <MainFrame>
            <NaviBar />
            {/* 여기에 코드를 작성해주세요. */}
        </MainFrame>
    )
}

export default MySchedulePage;