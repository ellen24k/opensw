import styles from "../styles/Header.module.css";
import checkIcon from "../resources/check.svg";
import nightIcon from "../resources/night.svg";

function Header() {
    return (
        <div className={styles.Header}>
            <div>DKU Class Room Schedule<img src={checkIcon} alt="check image"></img></div>
            <img src={nightIcon} alt="night image"></img>
        </div>
    )
}

export default Header;