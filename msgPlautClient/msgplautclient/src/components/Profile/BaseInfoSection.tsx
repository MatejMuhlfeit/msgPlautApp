import React from "react";
import api from "../../api/axiosInstance";
import styles from "../../pages/ProfilePage.module.css";
import { useState } from "react";

interface BaseInfoSectionProps {
    data: any;
    onUpdate: () => void;
}

const BaseInfoSection = ({data, onUpdate}: BaseInfoSectionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: data.name || '',
        surname: data.surname || '',
        position: data.position || '',
        employmentType: data.employmentType || '',
        city: data.city || '',
        country: data.country || '',
        birthYear: data.birthYear || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev =>({
            ...prev,
            [name]: name === 'birthYear' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            await api.put('profile/basic-info', formData);
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error("Chyba při ukládání základních údajů", error)
        }
    };

    if (isEditing){
        return (
            <section className={styles.sectionCard}>
                <div className={styles.header}>
                    <h3>Upravit základní údaje</h3>
                </div>
                <form onSubmit={handleSubmit} className={styles.gridForm}>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Jméno" required  />
                    <input name="surname" value={formData.surname} onChange={handleChange} placeholder="Přijmění" required />
                    <input name="position" value={formData.position} onChange={handleChange} placeholder="Pozice" required/>
                    <input name="employmentType" value={formData.employmentType} onChange={handleChange} placeholder="Typ zaměstnání" required/>
                    <input name="city" value={formData.city} onChange={handleChange} placeholder="Město" required/>
                    <input name="country" value={formData.country} onChange={handleChange} placeholder="Stát" required/>
                    <div className={styles.fullWidth}>
                        <label>Rok narození:</label>
                        <select name="birthYear" value={formData.birthYear} onChange={handleChange}>
                            {Array.from({ length: 60 }, (_, i) => 1960 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formActions}>
                        <button type="submit" className={styles.saveBtn}>Uložit</button>
                        <button type="button" className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Zrušit</button>
                    </div>
                </form>
            </section>
        );
    }

    return (
        <section className={styles.sectionCard}>
            <div className={styles.header}>
                <h3>Základní Informace</h3>
                <button type="button" onClick={() => setIsEditing(true)} className={styles.editBtn}>Upravit profil</button>
            </div>
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}><strong>Jméno:</strong> {data.name} {data.surname}</div>
                <div className={styles.infoItem}><strong>Email:</strong> {data.email}</div>
                <div className={styles.infoItem}><strong>Pozice:</strong> {data.position}</div>
                <div className={styles.infoItem}><strong>Typ zaměstnání:</strong> {data.employmentType}</div>
                <div className={styles.infoItem}><strong>Rok Narození:</strong> {data.birthYear}</div>
                <div className={styles.infoItem}><strong>Město:</strong> {data.city}</div>
                <div className={styles.infoItem}><strong>Stát:</strong> {data.country}</div>
            </div>
        </section>
    )
}

export default BaseInfoSection