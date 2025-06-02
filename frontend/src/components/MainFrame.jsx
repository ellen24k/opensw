import Header from "./Header.jsx";
import Main from "./Main.jsx";
import Footer from "./Footer.jsx";
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