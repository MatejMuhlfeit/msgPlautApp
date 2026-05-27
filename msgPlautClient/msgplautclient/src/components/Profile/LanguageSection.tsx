import { useState } from "react";
import api from "../../api/axiosInstance";
import styles from "../../pages/ProfilePage.module.css"
import LanguageForm from "./LanguageForm";

interface Language {
    id: string;
    languageName: string;
    level: string;
}

const LanguageSection = ({data, onUpdate}: {data: Language[], onUpdate: () => void}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (window.confirm("Opravdu chcete smazat tento jazyk?")) {
            try {
                await api.delete(`profile/languages/${id}`);
                onUpdate();
            } catch (error) {
                console.error("Chyba při mazání", error)
            }
        }
    };


    return (
        <section className={styles.sectionCard}>
            <div className={styles.header}>
                <h3>Jazyky</h3>
                {!isAdding && !editingId && (
                    <button onClick={() => setIsAdding(true)} className={styles.editBtn}>+ Přidat Jazyk</button>
                )}
            </div>
            <div className={styles.list}>
                {data.map(lan => (
                    editingId === lan.id ? (
                    <LanguageForm 
                        key={lan.id}
                        initialData={lan}
                        onClose={() => setEditingId(null)}
                        onUpdate={onUpdate}
                    />
                    ) : (
                        <div key={lan.id} className={styles.item}>
                            <div className={styles.itemContent}>
                                <strong>{lan.languageName}</strong><span> - {lan.level}</span>
                            </div>
                            <div className={styles.actions}>
                                <button onClick={() => setEditingId(lan.id)} className={styles.editIconBtn}>Upravit</button>
                                <button onClick={() => handleDelete(lan.id)} className={styles.deleteIconBtn}>Smazat</button>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {isAdding && (
                <LanguageForm
                    onClose={() => setIsAdding(false)}
                    onUpdate={onUpdate}
                />
            )}
        </section>
    );
};

export default LanguageSection;