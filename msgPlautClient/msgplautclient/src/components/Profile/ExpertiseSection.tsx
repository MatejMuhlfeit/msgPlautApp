import { useState } from "react";
import api from "../../api/axiosInstance";
import styles from "../../pages/ProfilePage.module.css";
import ExpertiseForm from "./ExpertiseForm";

interface ExpertiseArea {
    id: string;
    expertiseAreaName: string;
}

interface Expertise {
    id: string;
    expertiseName: string;
    expertiseAreaId: string;
    employeeExpertiseArea?: ExpertiseArea;
}

const ExpertiseSection = ({ data, onUpdate }: { data: Expertise[], onUpdate: () => void }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (window.confirm("Opravdu chcete smazat tuto schopnost?")) {
            try {
                await api.delete(`profile/expertises/${id}`);
                onUpdate();
            } catch (error) {
                console.error("Chyba při mazání expertízy", error);
            }
        }
    };

    return (
        <section className={styles.sectionCard}>
            <div className={styles.header}>
                <h3>Expertíza a Schopnosti</h3>
                {!isAdding && !editingId && (
                    <button onClick={() => setIsAdding(true)} className={styles.editBtn}>
                        + Přidat Schopnost
                    </button>
                )}
            </div>

            <div className={styles.list}>
                {data.map(exp => (
                    editingId === exp.id ? (
                        <ExpertiseForm 
                            key={exp.id}
                            initialData={exp}
                            onClose={() => setEditingId(null)}
                            onUpdate={onUpdate}
                        />
                    ) : (
                        <div key={exp.id} className={styles.item}>
                            <div className={styles.itemContent}>
                                <strong>{exp.expertiseName}</strong>
                                <p className={styles.itemDates}>
                                    Oblast: {exp.employeeExpertiseArea?.expertiseAreaName || 'Neuvedena'}
                                </p>
                            </div>
                            <div className={styles.actions}>
                                <button onClick={() => setEditingId(exp.id)} className={styles.editIconBtn}>
                                    Upravit
                                </button>
                                <button onClick={() => handleDelete(exp.id)} className={styles.deleteIconBtn}>
                                    Smazat
                                </button>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {isAdding && (
                <ExpertiseForm
                    onClose={() => setIsAdding(false)}
                    onUpdate={onUpdate}
                />
            )}
        </section>
    );
};

export default ExpertiseSection;


