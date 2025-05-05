import styles from "../styles/Footer.module.css";

function Footer() {
    return (
        <div>
            <footer className={styles.Footer}>
                <address>
                    더 많은 정보는 문의하세요.<br />
                    <a href="mailto:psmsq4@dankook.ac.kr">단국대학교 소프트웨어학과</a>
                </address>
            </footer>
        </div>
    )
}

export default Footer;