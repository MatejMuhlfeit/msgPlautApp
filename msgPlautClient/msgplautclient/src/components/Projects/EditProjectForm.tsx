import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import styles from "./EditProjectForm.module.css";

const EditProjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [projectInfo, setProjectInfo] = useState<any>(null);
    const [activitiesLookup, setActivitiesLookup] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([""]);

    useEffect(() => {
        api.get('/Project/lookup').then(res => setActivitiesLookup(res.data));

        api.get(`/Project/edit-detail/${id}`).then(res => {
            setProjectInfo(res.data.project);
            if (res.data.selectedActivityIds && res.data.selectedActivityIds.length > 0) {
                setSelectedIds(res.data.selectedActivityIds);
            } else {
                setSelectedIds([""]);
            }
        });
    }, [id]);

    const addActivityField = () => {
        if (selectedIds.length < 10) {
            setSelectedIds([...selectedIds, ""]);
        }
    };

    const removeActivityField = (index: number) => {
        const updated = selectedIds.filter((_, i) => i !== index);
        setSelectedIds(updated.length ? updated : [""]);
    };

    const handleActivityChange = (index: number, value: string) => {
        const updated = [...selectedIds];
        updated[index] = value;
        setSelectedIds(updated);
    };

    const handleSubmit = async () => {
    try {
        // Vytvoříme objekt přesně podle DTO
        const payload = {
            projectId: id,
            selectedActivities: selectedIds.filter(x => x !== "")
        };

        console.log("Odesílám data:", payload);

        await api.post('/project/activate', payload);
        navigate('/projects');
    } catch (error) {
        console.error("Chyba při ukládání", error);
        alert("Nepodařilo se uložit aktivity.");
    }
};
    if (!projectInfo) return <div>Načítám...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.readOnlySection}>
                <div className={styles.inputGroup}>
                    <input value={projectInfo.name || ""} disabled />
                    <input value={projectInfo.uniqueKey || ""} disabled />
                    <input value={projectInfo.customer || ""} disabled />
                    <input value={projectInfo.branch || ""} disabled />
                    <input value={projectInfo.language || ""} disabled />
                    <input value={projectInfo.location || ""} disabled />
                    <textarea value={projectInfo.description || ""} rows={3} disabled />
                </div>
            </div>

            <div className={styles.activitySection}>
                <h3>Vaše činnosti ({selectedIds.length}/10)</h3>

                {selectedIds.map((currentValue, index) => (
                    <div key={`row-${index}`} className={styles.activityRow}>
                        <select
                            value={currentValue} // Toto ID (GUID) se spáruje s value v <option>
                             onChange={(e) => handleActivityChange(index, e.target.value)}
                        >
                             <option value="">-- Vyberte činnost --</option>
                                {activitiesLookup.map(act => (
                                <option key={act.activityId} value={act.activityId}>
                                {act.activityName}
                            </option>
                            ))}
                        </select>

     
                {selectedIds.length > 1 && (
                    <button 
                        type="button" 
                        onClick={() => removeActivityField(index)}
                        className={styles.removeBtn}
                    >
                        x
                    </button>
                )}
            </div>
                ))}

                {selectedIds.length < 10 && (
                    <button
                        type="button"
                        onClick={addActivityField}
                        className={styles.addBtn}
                    >
                        + Přidat další činnost
                    </button>
                )}
            </div>

            <div className={styles.footer}>
                <button type="button" onClick={handleSubmit} className={styles.saveBtn}>
                    Uložit
                </button>
                <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => navigate('/projects')}
                >
                    Zrušit
                </button>
            </div>
        </div>
    );
};

export default EditProjectForm;