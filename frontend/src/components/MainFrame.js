import { useState } from 'react';
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import styles from "../styles/MainFrame.module.css";

function MainFrame({ children }) {
    return (
        <div className={styles.MainFrame}>
            <Header></Header>
            <Main> {children} </Main>
            <Footer></Footer>
        </div>
    )
}

export default MainFrame;