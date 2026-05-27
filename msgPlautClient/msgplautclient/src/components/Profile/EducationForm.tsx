import { useState } from "react";
import api from "../../api/axiosInstance";
import styles from "../../pages/ProfilePage.module.css"



const EducationForm = ({initialData, onClose, onUpdate}: any) => {
    const [formData, setFormData ] = useState({
        institutionName: initialData?.institutionName || '',
        degree: initialData?.degree || '',
        fieldOfStudy: initialData?.fieldOfStudy || '',
        graduationYear: initialData?.graduationYear || '',
        isCurrent: initialData ? !initialData.graduationYear : false
    });

    const handleChange = (e: any) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            endYear: formData.isCurrent ? null : Number(formData.graduationYear)
        };

        try {
            if(initialData) {
                await api.put(`profile/educations/${initialData.id}`, payload);
            } else {
                await api.post('profile/educations', payload);
            }
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Chyba při ukládání vzdělání", error);
        }
    };

    return (
        <form className={styles.gridForm} onSubmit={handleSubmit}>
            <input 
                name="institutionName" 
                value={formData.institutionName} 
                onChange={handleChange} 
                placeholder="Název školy" 
                required
            />
            <input 
                name="degree" 
                value={formData.degree} 
                onChange={handleChange} 
                placeholder="Titul" 
                required
            />
            <input 
                name="fieldOfStudy" 
                value={formData.fieldOfStudy} 
                onChange={handleChange} 
                placeholder="Obor" 
                required
            />
            {!formData.isCurrent && (
                <input 
                    type="number" 
                    name="graduationYear" 
                    value={formData.graduationYear} 
                    onChange={handleChange} 
                    placeholder="Rok ukončení" 
                    required
                />
            )}

            <div className={styles.checkboxContainer}>
                <input 
                    type="checkbox"
                    name="isCurrent"
                    id="isCurrentEdu"
                    checked={formData.isCurrent}
                    onChange={handleChange}
                />
                <label htmlFor="isCurrentEdu">Stále studuji</label>
            </div>
            <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>Uložit</button>
                <button type="button" onClick={onClose} className={styles.cancelBtn}>Zrušit</button>
            </div>
        </form>
    );

};

export default EducationForm;