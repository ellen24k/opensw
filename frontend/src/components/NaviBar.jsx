import styles from '../styles/NaviBar.module.css';
import clsx from 'clsx'; // css를 쉽게 다룰 수 있게 하는 라이브러리
import { NavLink } from 'react-router-dom';

const options = {
    find_empty_class: {
        id: 0,
        name: '빈 강의실',
        link: '/FindEmptyClassPage',
    },
    view_class_schedule: {
        id: 1,
        name: '강의실 시간표',
        link: '/ViewClassSchedulePage',
    },
    my_schedule: {
        id: 2,
        name: '내 시간표',
        link: '/MySchedulePage',
    },
};

const iterableOptions = Object.entries(options);

function NaviBar() {
    const LinkSelectedClass = clsx(styles.RemoveLinkDeco, styles.LinkItem, styles.LinkSelected); // 여러 조건 선택자와 같은 효과
    const LinkNotSelectedClass = clsx(styles.RemoveLinkDeco, styles.LinkItem, styles.LinkNotSelected);

    return (
        <div className={styles.NaviBar}>
            {iterableOptions.map(([key, item]) => {
                return (
                    <NavLink
                        key={item.id}
                        id={item.id}
                        to={item.link}
                        className={({ isActive }) => isActive ? LinkSelectedClass : LinkNotSelectedClass}
                    >
                        {item.name}
                    </NavLink>
                );
            })}
        </div >
    );
}

export default NaviBar;
