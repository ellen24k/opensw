import styles from "../styles/NaviBar.module.css";
import { useState, useContext } from "react";
import { SelectedOptionIdContext, SelectedOptionIdSetterContext } from "./NaviContext";
import clsx from "clsx"; // css를 쉽게 다룰 수 있게 하는 라이브러리
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const options = {
    "find_empty_class": {
        "id": 0,
        "name": "빈 강의실",
        "link": "/FindEmptyClassPage",
    },
    "view_class_schedule": {
        "id": 1,
        "name": "강의실 시간표",
        "link": "/ViewClassSchedulePage",
    },
    "my_schedule": {
        "id": 2,
        "name": "내 시간표",
        "link": "/MySchedulePage",
    },
};

const iterableOptions = Object.entries(options);

function NaviBar() {
    const selectedOptionId = useContext(SelectedOptionIdContext)
    const setSelectedOptionId = useContext(SelectedOptionIdSetterContext)

    function handleClickNaviItem(e) {
        setSelectedOptionId(parseInt(e.target.id))
    }

    const LinkSelectedClass = clsx(styles.LinkItem, styles.LinkSelected) // 여러 조건 선택자와 같은 효과
    const LinkNotSelectedClass = clsx(styles.LinkItem, styles.LinkNotSelected)

    return (
        <div className={styles.NaviBar}>
            {iterableOptions.map((item, i) => {
                return <div key={item[1]["id"]} className={
                    selectedOptionId == i ? LinkSelectedClass : LinkNotSelectedClass
                }><Link id={item[1]["id"]} to={item[1]["link"]} className={styles.RemoveLinkDeco} onClick={handleClickNaviItem}>{item[1]["name"]}</Link></div>
            })}
        </div>
    );
}

export default NaviBar