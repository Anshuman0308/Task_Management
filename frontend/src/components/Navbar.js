import { NavLink, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../auth';

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const role = localStorage.getItem('role');

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav>
      <span className="brand">⬛ TaskManager</span>
      <div className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        {role === 'ADMIN' && <NavLink to="/members">Members</NavLink>}
        <span style={{ color: '#777', fontSize: '0.8rem' }}>{user?.email}</span>
        <span className={`badge ${role === 'ADMIN' ? 'badge-admin' : 'badge-member'}`}
          style={{ fontSize: '0.7rem' }}>{role}</span>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
