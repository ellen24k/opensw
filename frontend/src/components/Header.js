import styles from "../styles/Header.module.css";
import checkIcon from "../resources/check.svg";
import nightIcon from "../resources/night.svg";

function Header() {
    return (
        <div className={styles.Header}>
            <div className={styles.BrandLogo}>
                <span style={{ color: 'rgb(3, 83, 156)' }}>DKU</span>&nbsp;
                <span style={{ color: 'rgb(100, 167, 227)' }}> Class Room Schedule</span>
                <img src={checkIcon} alt="check image"></img>
            </div>
            <img src={nightIcon} alt="night image"></img>
        </div >
    )
}

export default Header;