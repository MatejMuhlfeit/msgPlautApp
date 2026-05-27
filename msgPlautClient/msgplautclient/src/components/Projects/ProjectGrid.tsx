import React, {useState, useEffect} from "react";
import api from "../../api/axiosInstance";
import styles from "./ProjectGrid.module.css"
import { useNavigate } from "react-router-dom";


interface Project {
    projectId: string;
    name: string;
    startTime: string;
    endTime: string | null;
    assignmentState: string;
}




const ProjectGrid: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        api.get('/Project/my-projects')
            .then(res => {
                setProjects(res.data)
                setLoading(false);
            })
            .catch (error => {
                console.error("Chyba při načítání projektů", error)
                setLoading(false);
            })
    }, []);

    if (loading) return <div>Načítám projekty...</div>;
    if (projects.length === 0) return <div>Zatím nemáte přiřezené žádné projekty</div>

    return (
        <div className={styles.grid}>
            {projects.map(project =>(
                <div key={project.projectId} className={styles.card}>
                    <div className={styles.statusBadge}>{project.assignmentState}</div>
                    <h3>{project.name}</h3>
                    <div className={styles.footer}>
                        <span>{project.startTime} - {project.endTime || "dosud"}</span>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.editBtn}
                            onClick={() => navigate(`/projects/edit/${project.projectId}`)}
                        >
                            Upravit Projekt
                        </button>
                        <button
                            className={styles.viewBtn}
                            onClick={() => navigate(`/projects/view/${project.projectId}`)}
                        >
                            Zobrazit
                        </button>

                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectGrid;