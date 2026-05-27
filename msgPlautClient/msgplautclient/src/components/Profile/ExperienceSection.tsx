import { useState } from "react";
import api from "../../api/axiosInstance";
import styles from "../../pages/ProfilePage.module.css"
import ExperienceForm from "./ExperienceForm";

interface Experience {
    id: string;
    companyName: string;
    position: string;
    startYear: number;
    endYear?: number | null;
    workActivities: string;
}

const ExperienceSection = ({data, onUpdate}: {data: Experience[], onUpdate: () => void}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (window.confirm("Opravdu chcete smazat tuto pracovní zkušenost?")) {
            try {
                await api.delete(`profile/work-experiences/${id}`);
                onUpdate();
            } catch (error) {
                console.error("Chyba při mazání", error)
            }
        }
    };


    return (
        <section className={styles.sectionCard}>
            <div className={styles.header}>
                <h3>Historie Zaměstnání</h3>
                {!isAdding && !editingId && (
                    <button onClick={() => setIsAdding(true)} className={styles.editBtn}>+ Přidat Praxi</button>
                )}
            </div>
            <div className={styles.list}>
                {data.map(exp => (
                    editingId === exp.id ? (
                    <ExperienceForm 
                        key={exp.id}
                        initialData={exp}
                        onClose={() => setEditingId(null)}
                        onUpdate={onUpdate}
                    />
                    ) : (
                        <div key={exp.id} className={styles.item}>
                            <div className={styles.itemContent}>
                                <strong>{exp.position}</strong> v <span>{exp.companyName}</span>
                                <p className={styles.itemDates}>
                                    {exp.startYear} - {exp.endYear || 'Současnost'}
                                </p>
                                <p className={styles.description}>{exp.workActivities}</p>
                            </div>
                            <div className={styles.actions}>
                                <button onClick={() => setEditingId(exp.id)} className={styles.editIconBtn}>Upravit</button>
                                <button onClick={() => handleDelete(exp.id)} className={styles.deleteIconBtn}>Smazat</button>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {isAdding && (
                <ExperienceForm
                    onClose={() => setIsAdding(false)}
                    onUpdate={onUpdate}
                />
            )}
        </section>
    );
};

export default ExperienceSection;