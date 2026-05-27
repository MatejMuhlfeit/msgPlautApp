import React, { useState } from "react"
import api from "../../api/axiosInstance";
import styles from "../../pages/ProfilePage.module.css"

const ExperienceForm = ({ initialData, onClose, onUpdate}: any) => {
    const [formData, setFormData]= useState({
        companyName: initialData?.companyName || '',
        position: initialData?.position || '',
        startYear: initialData?.startYear || '',
        endYear: initialData?.endYear || '',
        workActivities: initialData?.workActivities || '',
        isCurrent: initialData ? !initialData.endYear : false
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
        const payload ={
            ...formData,
            endYear: formData.isCurrent ? null : Number(formData.endYear)
        };
        try {
    if (initialData) {
        await api.put(`profile/work-experiences/${initialData.id}`, payload);
    } else {
        await api.post('profile/work-experiences', payload);
    }
    onUpdate(); 
    onClose(); 
} catch (error) {
    console.error("Chyba při ukládání praxe", error);
}
    };
    return (
        <form onSubmit={handleSubmit} className={styles.gridForm}>
            <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Název firmy" required/>
            <input name="position" value={formData.position} onChange={handleChange} placeholder="Pozice" required/>
            <input name="startYear" value={formData.startYear} onChange={handleChange} placeholder="Rok nástupu" required/>
            {!formData.isCurrent && (
                <input name="endYear" value={formData.endYear} onChange={handleChange} placeholder="Rok ukončení"/>
            )}
            <div className={styles.fullWidth}>
                <input
                    type="checkbox"
                    name="isCurrent"
                    id="isCurrent"
                    checked={formData.isCurrent}
                    onChange={handleChange}
                    style={{width:'auto'}}
                />
                <label htmlFor="isCurrent">Aktuálně zde pracuji</label>
            </div>

            <textarea 
                name="workActivities"
                className={styles.fullWidth}
                value={formData.workActivities}
                onChange={handleChange}
                placeholder="popis činnosti..."
                rows={3}
            />

            <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>Uložit</button>
                <button type="button" onClick={onClose} className={styles.cancelBtn}>Zrušit</button>
            </div>
        </form>
    );
    
};

export default ExperienceForm;

