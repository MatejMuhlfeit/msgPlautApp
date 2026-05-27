import {useState} from "react";
import api from "../../api/axiosInstance";
import styles from "../../pages/ProfilePage.module.css";
import EducationForm from "./EducationForm";

interface Education {
    id: string;
    institutionName: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear?: number | null;
}

const EducationSection = ({data, onUpdate}: {data: Education[], onUpdate: () => void}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if(window.confirm("Opravdu chcete smazat tento záznam o vzdělání")) {
            try {
                await api.delete(`profile/educations/${id}`);
                onUpdate();
            } catch (error) {
                console.error("Chyba při mazání záznamu o vzdělání", error);
            }
        }
    };

    return (
        <section className={styles.sectionCard}>
            <div className={styles.header}>
                <h3>Vzdělání</h3>
                {!isAdding && !editingId && (
                    <button onClick={() => setIsAdding(true)} className={styles.editBtn}>+ Přidat vzdělání</button>
                )}
            </div>

           <div className={styles.list}>
                {data.map(edu => (
                    editingId === edu.id ? (
                        <EducationForm 
                            key={edu.id} 
                            initialData={edu} 
                            onClose={() => setEditingId(null)} 
                            onUpdate={onUpdate} 
                        />
                    ) : (
                        <div key={edu.id} className={styles.item}>
                            <div className={styles.itemContent}>
                                <strong>{edu.institutionName}</strong>
                                <p className={styles.itemDates}>
                                    {edu.degree} — {edu.fieldOfStudy} ({edu.graduationYear || 'Studuji'})
                                </p>
                            </div>
                            <div className={styles.actions}>
                                <button onClick={() => setEditingId(edu.id)} className={styles.editIconBtn}>Upravit</button>
                                <button onClick={() => handleDelete(edu.id)} className={styles.deleteIconBtn}>Smazat</button>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {isAdding && (
                <EducationForm 
                    onClose={() => setIsAdding(false)} 
                    onUpdate={onUpdate} 
                />
            )}
        </section>
    );
};

export default EducationSection;