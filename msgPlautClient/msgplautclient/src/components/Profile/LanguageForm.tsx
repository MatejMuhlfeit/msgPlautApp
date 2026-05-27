import { useState } from "react";
import styles from "../../pages/ProfilePage.module.css"
import api from "../../api/axiosInstance";


const LanguageForm = ({ initialData, onClose, onUpdate }: any) => {
    const [formData, setFormData] = useState({
        languageName: initialData?.languageName || '',
        level: initialData?.level || 'B2' // Výchozí hodnota
    });

    const levels = ["A1", "A2", "B1", "B2", "C1", "C2", "Rodilý mluvčí"];
    const languages = ["Čeština", "Angličtina", "Němčina" ];

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            const payload = { 
                languageName: formData.languageName, 
                level: formData.level 
            };
            
            if (initialData) {
                await api.put(`profile/languages/${initialData.id}`, payload);
            } else {
                await api.post('profile/languages', payload);
            }
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Chyba při ukládání jazyka", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.gridForm}>
             <select 
                name="lanugage" 
                value={formData.languageName} 
                onChange={(e) => setFormData({...formData, languageName: e.target.value})}
            >
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            
            <select 
                name="level" 
                value={formData.level} 
                onChange={(e) => setFormData({...formData, level: e.target.value})}
            >
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>Uložit</button>
                <button type="button" onClick={onClose} className={styles.cancelBtn}>Zrušit</button>
            </div>
        </form>
    );
};

export default LanguageForm;