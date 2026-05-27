import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import styles from "./ProjectDetail.module.css";

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [projectInfo, setProjectInfo] = useState<any>(null);
    const [selectedActivityNames, setSelectedActivityNames] = useState<string[]>([]);

    useEffect(() => {
        api.get(`/project/detail/${id}`)
            .then(res => {
                console.log("Data z backendu:", res.data)
                setProjectInfo(res.data.project);
                setSelectedActivityNames(res.data.activities || []);
            })
            .catch(err => console.error("Chyba při načítání detailu:", err));
    }, [id]);

    if (!projectInfo) return <div className={styles.loader}>Načítám detail projektu...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Detail projektu</h1>
                <button onClick={() => navigate('/projects')} className={styles.backBtn}>
                    Zpět na seznam
                </button>
            </header>

            <div className={styles.detailGrid}>
                {/* Informace o projektu - vše disabled */}
                <div className={styles.infoGroup}>
                    <label>Název projektu</label>
                    <input value={projectInfo.name || ""} disabled />
                </div>

                <div className={styles.infoGroup}>
                    <label>Unikátní klíč</label>
                    <input value={projectInfo.uniqueKey || ""} disabled />
                </div>

                <div className={styles.infoGroup}>
                    <label>Zákazník</label>
                    <input value={projectInfo.customer || ""} disabled />
                </div>

                <div className={styles.infoGroup}>
                    <label>Pobočka / Jazyk / Lokalita</label>
                    <div className={styles.tripleInput}>
                        <input value={projectInfo.branch || ""} disabled />
                        <input value={projectInfo.language || ""} disabled />
                        <input value={projectInfo.location || ""} disabled />
                    </div>
                </div>

                <div className={styles.infoGroup}>
                    <label>Popis</label>
                    <textarea value={projectInfo.description || ""} rows={4} disabled />
                </div>
            </div>

            <div className={styles.activitySection}>
                <h3>Přiřazené činnosti</h3>
                {selectedActivityNames.length > 0 ? (
                    <ul className={styles.activityList}>
                        {selectedActivityNames.map((name, index) => (
                            <li key={index} className={styles.activityItem}>
                                <span className={styles.badge}>{index + 1}</span>
                                {name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noData}>K tomuto projektu nejsou přiřazeny žádné činnosti.</p>
                )}
            </div>

            <div className={styles.footer}>
                <button 
                    onClick={() => navigate(`/projects/edit/${id}`)} 
                    className={styles.editBtn}
                >
                    Upravit projekt
                </button>
            </div>
        </div>
    );
};

export default ProjectDetail;