import React, {useState, useEffect} from 'react';
import styles from "./ProjectPage.module.css"
import { useNavigate } from 'react-router-dom';
import ProjectGrid from '../components/Projects/ProjectGrid';

const ProjectPage: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const userRole = sessionStorage.getItem('role');

        if(userRole?.toLocaleLowerCase() === 'admin'){
            setIsAdmin(true);
        }
    }, []);

    const handleCreateClick = () => {
        navigate('/projects/create')
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1>Projekty</h1>

                {isAdmin && (
                    <button
                        className={styles.createBtn}
                        onClick={handleCreateClick}
                    >
                        + Vytvořit Projekt
                    </button>
                )}
            </header>

            <section className={styles.content}>
                <ProjectGrid />
            </section>
        </div>
    );
};

export default ProjectPage;