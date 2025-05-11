import MainFrame from "./MainFrame.js"
import NaviBar from "./NaviBar.js"
import { useState, useContext, useEffect } from "react";
import { SelectedOptionIdSetterContext } from "./NaviContext.js";

function IntroPage() {
    const setSelectedOptionId = useContext(SelectedOptionIdSetterContext)
    useEffect(() => {
        setSelectedOptionId(0)
    }, [])

    return (
        <MainFrame>
            <NaviBar />
        </MainFrame>
    )
}

export default IntroPage;