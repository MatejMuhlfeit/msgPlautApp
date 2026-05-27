import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import styles from "./CVPreview.module.css";
import msgPlautLogo from "../imgs/msgPlautLogo.png";
import portrait from "../imgs/portrait.jpg";

const CVPreview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const selectedProjectIds = location.state?.projectIds || [];

    useEffect(() => {
        if (selectedProjectIds.length === 0) {
            alert("Nejsou vybrány žádné projekty pro CV.");
            navigate("/cv-selector");
            return;
        }

        const fetchData = async () => {
            try {
                const [profileRes, projectsRes] = await Promise.all([
                    api.get("/Profile"),
                    api.post("/Project/cv-details", selectedProjectIds)
                ]);

                setData({
                    profile: profileRes.data,
                    projects: projectsRes.data
                });
            } catch (err) {
                console.error("Chyba při načítání dat pro CV:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedProjectIds, navigate]);

    if (loading) return <div className={styles.noPrint}>Připravuji CV...</div>;
    if (!data) return null;



return (
    <div className={styles.pageContainer}>
        <div className={`${styles.toolbar} ${styles.noPrint}`}>
            <button onClick={() => navigate(-1)} className={styles.cancelBtn}>Zpět</button>
            <button onClick={() => window.print()} className={styles.printBtn}>Uložit jako PDF</button>
        </div>

        <div className={styles.a4Sheet}>
            <div className={styles.logoContainer}>
                <img src={msgPlautLogo} alt="msg Plaut" className={styles.logo} />
            </div>

            <div className={styles.cvLayout}>
                <aside className={styles.sidebar}>
                    <div className={styles.photoBox}>
                        <img src={portrait} alt="Profilový obrázek" className={styles.photo} />
                    </div>
                    <div className={styles.personalData}>
                        <p>Rok Narození: <span>{data.profile.birthYear}</span></p>
                        <p>Národnost: <span>{data.profile.nationality || "Česká"}</span></p>
                        <p>Bydliště: <span>{data.profile.city}, {data.profile.country}</span></p>
                    </div>

                    <div className={styles.sidebarSection}>
                        <h4>Jazyky:</h4>
                        <ul>
                            {data.profile.languages?.map((l: any) => (
                                <li key={l.id}>{l.languageName}, {l.level}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.sidebarSection}>
                        <h4>Odbornost:</h4>
                        <ul>
                            {data.profile.expertises?.map((exp: any) => (
                                <li key={exp.id}>
                                    <p>{exp.expertiseName} ({exp.employeeExpertiseArea?.expertiseAreaName})</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.sidebarSection}>
                        <h4>Pozice:</h4>
                        <p>{data.profile.position}</p>
                    </div>
                </aside>

                <main className={styles.mainContent}>
                    <h1 className={styles.nameHeader}>
                        {data.profile.name.toUpperCase()}<br />
                        <span className={styles.surname}>{data.profile.surname.toUpperCase()}</span>
                        
                    </h1>

                    <section className={styles.mainSection}>
                        <h2>Shrnutí odbornosti</h2>
                        <p className={styles.summaryText}>{data.profile.bio || "Text nebyl vyplněn."}</p>
                    </section>

                    <section className={styles.mainSection}>
                        <h2>Historie Zaměstnání</h2>
                        {data.profile.workExperiences?.map((exp: any) => (
                            <div key={exp.id} className={styles.experienceRow}>
                                <div className={styles.experienceYears}>
                                    {exp.startYear} – {exp.endYear || "současnost"}
                                </div>
                                <div className={styles.experienceDetail}>
                                    <div className={styles.companyName}>{exp.companyName}</div>
                                    <div className={styles.positionAndActivity}>
                                        <strong>{exp.position}</strong> {exp.workActivities}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className={styles.mainSection}>
                        <h2>Vzdělání</h2>
                        {data.profile.educations?.map((edu: any) => (
                            <div key={edu.id} className={styles.experienceRow}>
                                <div className={styles.experienceYears}>{edu.graduationYear}</div>
                                <div className={styles.experienceDetail}>
                                    <strong>{edu.institutionName}</strong> ({edu.degree})
                                    <div>{edu.fieldOfStudy}</div>
                                </div>
                            </div>
                        ))}
                    </section>
                </main>
                
            </div>
             <section className={styles.projectsPage}>
                        <h2>Projekty</h2>
                        {data.projects.map((proj: any) => (
                            <div key={proj.projectId} className={styles.project}>
                                <h3>{proj.projectName}</h3>
                                <ul>
                                    <li><strong>Zákazník:</strong> {proj.customer}</li>
                                    <li><strong>Oblast:</strong> {proj.branch}</li>
                                    <li><strong>Lokalita:</strong> {proj.location}</li>
                                    <li><strong>Jazyk:</strong> {proj.language}</li>
                                    <li><strong>Od:</strong> {proj.startTime} <strong>Do:</strong> {proj.endTime || "Dosud"}</li>
                                </ul> 
                            </div>
                        ))}
                        
                </section>
            <footer className={styles.footer}>
                <p>msg Plaut CZ s.r.o | Klimentstká 1216/46 | 110 00 Praha</p>
                <a href="https://www.msg-plaut.com/cs/">https://www.msg-plaut.com/cs/</a>
            </footer>
        </div>
    </div>
);
};
export default CVPreview;