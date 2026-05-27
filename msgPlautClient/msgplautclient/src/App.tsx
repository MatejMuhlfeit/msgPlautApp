import React from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Topbar from './components/Topbar'; 
import ProfilePage from './pages/ProfilePage';
import ProjectPage from './pages/ProjectPage';
import ProjectForm from './components/Projects/ProjectForm';
import EditProjectForm from './components/Projects/EditProjectForm';
import ProjectDetail from './components/Projects/ProjectDetail';
import CVProjectSelector from './components/CvProjectSelector';
import CVPreview from './components/CVPreview';

const HomePage = () => {
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    window.location.reload();
  };

  return (
    <div>
      <h1>Vítejte v msgPlautDB</h1>
      <p>Jste úspěšně přihlášeni.</p>
      <button onClick={handleLogout}>Odhlásit se</button>
    </div>
  )
};



const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = sessionStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};



function App() {
  return (
    <Router>
      <Routes>
        
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />

         <Route path="/" element={
          <PrivateRoute>
            <>
              <Topbar />
              <main style={{ padding: '2rem' }}>
                <HomePage />
              </main>
            </>
          </PrivateRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute>
            <>
              <Topbar />
              <main style={{ padding: '2rem' }}>
                <ProfilePage />
              </main>
            </>
          </PrivateRoute>
        } />

         <Route path="/projects" element={
          <PrivateRoute>
            <>
              <Topbar />
              <main style={{ padding: '2rem' }}>
                <ProjectPage />
              </main>
            </>
          </PrivateRoute>
        } />

        <Route path="/projects/create" element={
          <PrivateRoute>
            <>
              <Topbar />
              <main style={{ padding: '2rem' }}>
                <ProjectForm />
              </main>
            </>
          </PrivateRoute>
        } />

        <Route path="/projects/edit/:id" element={
          <PrivateRoute>
            <>
              <Topbar />
              <main style={{ padding: '2rem' }}>
                <EditProjectForm />
              </main>
            </>
          </PrivateRoute>
        } />

        <Route path="/projects/view/:id" element={
          <PrivateRoute>
            <>
              <Topbar />
              <main style={{ padding: '2rem' }}>
                <ProjectDetail />
              </main>
            </>
          </PrivateRoute>
        } />

        <Route path="/cvSelection" element={
          <PrivateRoute>
            <>
              <Topbar />
              <main style={{ padding: '2rem' }}>
                <CVProjectSelector />
              </main>
            </>
          </PrivateRoute>
        } />
         <Route path="/cvPreview" element={
          <PrivateRoute>
            <>
              <main style={{ padding: '2rem' }}>
                <CVPreview />
              </main>
            </>
          </PrivateRoute>
        } />





        

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;


