import MainFrame from "./MainFrame.js"
import NaviBar from "./NaviBar.js"
import { useState, useContext } from "react";
import { SelectedOptionIdSetterContext } from "./NaviContext.js";

function IntroPage() {
    const setSelectedOptionId = useContext(SelectedOptionIdSetterContext)
    setSelectedOptionId(0)

    return (
        <MainFrame>
            <NaviBar />
        </MainFrame>
    )
}

export default IntroPage;