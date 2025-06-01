import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import styles from "../styles/MainFrame.module.css";
import { Stack } from "@mui/material";

function MainFrame({ children, spacing, className }) {
    return (
        <Stack className={[styles.MainFrame, className]}>
            <Header></Header>
            <Main spacing={spacing}> {children} </Main>
            <Footer></Footer>
        </Stack>
    )
}

export default MainFrame;