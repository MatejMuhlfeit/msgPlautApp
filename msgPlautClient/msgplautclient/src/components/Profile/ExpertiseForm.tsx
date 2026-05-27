import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import styles from "../../pages/ProfilePage.module.css"

const ExpertiseForm = ({ initialData, onUpdate, onClose }: any) => {
  const [areas, setAreas] = useState<any[]>([]);
  const [formData, setFormData] = useState({
        expertiseName: initialData?.expertiseName || '',
        expertiseAreaId: initialData?.expertiseAreaId || '',
        expertiseAreaName: initialData?.expertiseAreaName || ''
  });

  
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/profile/expertise-areas');
        setAreas(response.data);
      } catch (err) {
        console.error("Chyba při načítání oblastí:", err);
      }
    };
    fetchAreas();
  }, []);


const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
};

const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
       const dataToSend = {
            expertiseName: formData.expertiseName,
            expertiseAreaId: formData.expertiseAreaId
        };

        if (initialData) {
            await api.put(`/profile/expertises/${initialData.id}`, dataToSend);
        } else {
            await api.post('/profile/expertises', dataToSend);
        }
        onUpdate();
        onClose();
    } catch (error) {
        console.error("Nepodařilo se uložit schopnost", error);
    }
};

return (
    <form onSubmit={handleSubmit} className={styles.gridForm}>
        <input 
            name='expertiseName' 
            value={formData.expertiseName} 
            onChange={handleChange} 
            placeholder='Schopnost' 
            required
        />

        <select
            name="expertiseAreaId"
            value={formData.expertiseAreaId}
            onChange={handleChange}
            required
        >
            <option value="">-- Vyberte oblast --</option>
            {areas.map((area: any) => (
                <option key={area.id} value={area.id}>
                    {area.expertiseAreaName}
                </option>
            ))}
        </select>

        <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>Uložit</button>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Zrušit</button>
        </div>
    </form>
);

};

export default ExpertiseForm;