import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import styles from "./CVProjectSelector.module.css";
import { useNavigate } from "react-router-dom";

interface Project {
    projectId: string;
    name: string;
    startTime: string;
    endTime: string;
    assignmentState: string;
}

const CVProjectSelector = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/project/my-projects")
            .then(res => {
                setProjects(res.data);
                setLoading(false);
            })
            .catch(err => console.error("Chyba:", err));
    }, []);

    const toggleProject = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleGenerateCV = () => {
    if (selectedIds.length === 0) {
        alert("Vyberte alespoň jeden projekt.");
        return;
    }

    navigate("/cvPreview", { 
        state: { projectIds: selectedIds } 
    });
};

    if (loading) return <div>Načítám projekty...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>Výběr projektů do CV</h2>
                <button onClick={handleGenerateCV} className={styles.generateBtn}>
                    Pokračovat na generování ({selectedIds.length})
                </button>
            </header>

            <div className={styles.grid}>
                {projects.map(project => (
                    <div 
                        key={project.projectId} 
                        className={`${styles.card} ${selectedIds.includes(project.projectId) ? styles.selected : ""}`}
                        onClick={() => toggleProject(project.projectId)}
                    >
                        <div className={styles.checkboxWrapper}>
                            <input 
                                type="checkbox" 
                                checked={selectedIds.includes(project.projectId)}
                                readOnly 
                            />
                        </div>
                        <div className={styles.content}>
                            <h3>{project.name}</h3>
                            <div className={styles.timeRow}>
                                <span>{project.startTime}</span> - <span>{project.endTime || "dosud"}</span>
                            </div>
                            
                            <span className={styles.stateBadge}>{project.assignmentState}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CVProjectSelector;