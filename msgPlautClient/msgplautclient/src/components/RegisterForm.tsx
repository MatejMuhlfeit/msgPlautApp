import React from "react";
import api from "../api/axiosInstance";
import styles from "./RegisterForm.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const RegisterForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        position: '',
        employmentType: '',
        city: '',
        country: '',
        birthYear: 1990,
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setError('');
        setFormData(prev => ({
            ...prev,
            [name]: name === 'birthYear' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Hesla se neshodují!');
            return;
        }
        try {
            const {confirmPassword, ...dataToPost} = formData;
            const response = await api.post('/auth/register', dataToPost);
            sessionStorage.setItem('token', response.data.token);
            navigate('/'); // Po registraci jde na Home (nebo do Profilu)
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <form className={styles.registerForm} onSubmit={handleSubmit}>
                <h2>Registrace Konzultanta</h2>
                    {error && <div className={styles.errorBanner}>{error}</div>}
                <div className={styles.grid}>
                    <input name="name" placeholder="Jméno" onChange={handleChange} required />
                    <input name="surname" placeholder="Příjmení" onChange={handleChange} required />
                    <input name="password" type="password" placeholder="Heslo" onChange={handleChange} required />
                    <input name="confirmPassword" type="password" placeholder="Potvrzení hesla" onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                    <input name="position" placeholder="Pozice (např. Senior Developer)" onChange={handleChange} required />
                    <input name="employmentType" placeholder="Typ zaměstnání (např. externista)" onChange={handleChange} required />
                    <input name="city" placeholder="Město" onChange={handleChange} required />
                    <input name="country" placeholder="Země" onChange={handleChange} required />
                
                <div className={styles.selectGroup}>
                    <label>Rok narození:</label>
                    <select name="birthYear" value={formData.birthYear} onChange={handleChange} required>
                        {Array.from({ length: 60 }, (_, i) => 1960 + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className={styles.submitBtn}>Vytvořit účet</button>
                
                <div className={styles.footer}>
                    Již máte účet? <Link to="/login">Přihlásit se</Link>
                </div>
            </div>
        </form>
        </div>
    );
};

export default RegisterForm;

