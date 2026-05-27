import React, {useState, useEffect} from 'react';
import api from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from "./ProjectForm.module.css"

const ProjectForm: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        customer: '',
        location: '',
        uniqueKey: '',
        branch: '',
        language: '',
        responsibleArea: '',
        startTime: '',
    });

    const [selectedEmployees, setSelectedEmployees] = useState<string[]>(['']);

    const [employeeList, setEmployeeList] = useState<any[]>([]);

    useEffect(() => {
        api.get('employee/lookup').then(res => setEmployeeList(res.data))
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleEmployeeChange = (index: number, value: string) => {
        const updated = [...selectedEmployees];
        updated[index] = value;
        setSelectedEmployees(updated);
    };

    const addEmployeeField = () => {
        if (selectedEmployees.length < 10) {
            setSelectedEmployees([...selectedEmployees, '']);
        }
    };

    const removeEmployeeField = (index: number) => {
        if (selectedEmployees.length > 1) {
            setSelectedEmployees(selectedEmployees.filter((_, i) => i !== index));
        }
    };




    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const employeeIds = selectedEmployees.filter(id => id != '');

        const payload = {
            ...formData,
            assignedEmployeeIds: employeeIds
        };

        try {
            await api.post('/Project/projects', payload)
            navigate('projects');
        } catch (error){
            console.error(error);
        }
    }

    return (
        <div className={styles.container}>
            <h2>Vytvořit nový projekt</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <input name="name" placeholder="Název projektu" onChange={handleInputChange} required/>
                    <input name="uniqueKey" placeholder="Zakázka (např: CZ1114-35)" onChange={handleInputChange} required/>
                    <input name="customer" placeholder="Zákazník" onChange={handleInputChange} required/>
                    <input name="location" placeholder="Lokatika" onChange={handleInputChange} required/>
                    <input name="branch" placeholder="Oblast Průmyslu (např. Automotive)" onChange={handleInputChange} required />
                    <input name="language" placeholder="Jazyk" onChange={handleInputChange} required/>
                    <input name="startTime" placeholder="Začátek (MM/RRRR)" onChange={handleInputChange} required />
                </div>
                <textarea name="description" placeholder="Popis Projektu" onChange={handleInputChange} required />

                <div className={styles.employeeSection}>
                    <h3>Přiřazení konzultantů ({selectedEmployees.length + "/10"})</h3>
                    {selectedEmployees.map((id, index) => (
                        <div key={index} className={styles.employeeRow}>
                            <select
                                value={id}
                                onChange={(e) => handleEmployeeChange(index, e.target.value)}
                                required
                            >
                                <option value="">-- Vyberte konzultanta --</option>
                                {employeeList.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.fullName} 
                                    </option>
                                ))}
                            </select>
                            {selectedEmployees.length > 1 && (
                                <button type="button" onClick={() => removeEmployeeField(index)}>x</button>
                            )}
                        </div>
                    ))}

                    {selectedEmployees.length < 10 && (
                        <button type="button" onClick={addEmployeeField} className={styles.addBtn}>
                            + Přidat dalšího konzultanta
                        </button>
                    )}
                </div>

                <div className={styles.actions}>
                    <button type="button" onClick={() => navigate('/projects')}>Zrušit</button>
                    <button type="submit" className={styles.submitBtn} onClick={() => navigate('/projects')}>Vytvořit projekt</button>
                </div>
            </form>
        </div>
    )
};

export default ProjectForm;