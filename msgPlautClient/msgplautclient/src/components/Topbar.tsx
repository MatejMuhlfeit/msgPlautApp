import { useNavigate } from "react-router-dom";
import styles from "./Topbar.module.css";

const Topbar = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className={styles.topbar}>
            <div className={styles.logo} onClick={() => navigate('/')}>
                msg<span>Plaut</span>DB
            </div>
            <div className={styles.menu}>
                <button onClick={() => navigate('/projects')}>Projekty</button>
                <button onClick={() => navigate('/profile')}>Profil</button>
                <button onClick={() => navigate('/cvSelection')}>Vygenerovat CV</button>
                <button className={styles.logoutBtn} onClick={handleLogout}>Odhlásit se</button>
            </div>
        </nav>
    )

}

export default Topbar;