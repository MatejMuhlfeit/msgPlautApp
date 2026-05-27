import api from "../api/axiosInstance";
import BaseInfoSection from "../components/Profile/BaseInfoSection";
import ExperienceSection from "../components/Profile/ExperienceSection";
import EducationSection from "../components/Profile/EducationSection";
import LanguageSection from "../components/Profile/LanguageSection";
import ExpertiseSection from "../components/Profile/ExpertiseSection";
import { useEffect, useState } from "react";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            setProfileData(response.data);
        } catch (error) {
            console.error('Chyba při načítání profilu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {fetchProfile()}, []);

    if (loading) return <div>Načítání profilu...</div>;

    return (
        <div className={styles.container}>
            <h1>Můj Profil</h1>
            <BaseInfoSection data={profileData} onUpdate={fetchProfile}></BaseInfoSection>
            <div className={styles.sectionGrid}>
                <ExperienceSection data={profileData.workExperiences} onUpdate={fetchProfile}/>
                <EducationSection data={profileData.educations} onUpdate={fetchProfile}/>
                <LanguageSection data={profileData.languages} onUpdate={fetchProfile}/>
                <ExpertiseSection data={profileData.expertises} onUpdate={fetchProfile}/>

            </div>
        </div>
    );

};

export default ProfilePage;