import { useState } from "react";
import api from "../api/axiosInstance";
import styles from "./LoginForm.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Inicializace

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        console.log("1. Pokus o přihlášení s:", email);

        try {
            const response = await api.post('/auth/login', { email, password });
            console.log("2. Odpověď z backendu:", response.data);

            const { token, role } = response.data;

            if (token) {
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('role', role)
                console.log("3. Token uložen, přesměrovávám...");
                navigate('/'); 
            } else {
                console.error("Token v odpovědi chybí!");
            }

        } catch (error: any) {
            console.error("Chyba při přihlášení:", error.response?.data || error.message);
            alert("Přihlášení selhalo: " + (error.response?.data?.message || "Špatné údaje"));
        }
    };

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
            <h2>Přihlášení</h2>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            <input  
                type="password" 
                placeholder="Heslo" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            <button type="submit">Vstoupit</button>
            <div className={styles.footer}>
                Nemáte učet? <Link to="/register">Zaregistrovat se</Link>
            </div>
        </form>
    );
};

export default LoginForm;