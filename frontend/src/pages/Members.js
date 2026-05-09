import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

export default function Members() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const currentEmail = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).sub;

  const load = () => api.get('/users').then(r => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const promote = async id => {
    if (window.confirm('Promote this user to Admin?')) {
      await api.post(`/users/${id}/promote`);
      load();
    }
  };

  const demote = async id => {
    if (window.confirm('Demote this admin to Member?')) {
      await api.post(`/users/${id}/demote`);
      load();
    }
  };

  const remove = async id => {
    if (window.confirm('Delete this user?')) {
      await api.delete(`/users/${id}`);
      load();
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const admins = filtered.filter(u => u.role === 'ADMIN');
  const members = filtered.filter(u => u.role === 'MEMBER');

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>Members</h1>
          <span style={{ fontSize: '0.85rem', color: '#777' }}>{users.length} total users</span>
        </div>

        {/* Stats */}
        <div className="stats" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div className="num">{users.length}</div>
            <div className="label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="num">{users.filter(u => u.role === 'ADMIN').length}</div>
            <div className="label">Admins</div>
          </div>
          <div className="stat-card">
            <div className="num">{users.filter(u => u.role === 'MEMBER').length}</div>
            <div className="label">Members</div>
          </div>
        </div>

        {/* Search */}
        <div className="form-group" style={{ maxWidth: 320, marginBottom: '1.5rem' }}>
          <input placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Admins Table */}
        {admins.length > 0 && (
          <>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>
              Admins <span className="badge badge-admin" style={{ marginLeft: 8 }}>{admins.length}</span>
            </h3>
            <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Tasks</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(u => (
                    <tr key={u.id}>
                      <td style={{ color: '#aaa' }}>{u.id}</td>
                      <td>
                        <strong>{u.name}</strong>
                        {u.email === currentEmail && (
                          <span style={{ fontSize: '0.75rem', color: '#777', marginLeft: 6 }}>(you)</span>
                        )}
                      </td>
                      <td>{u.email}</td>
                      <td><span className="badge badge-admin">ADMIN</span></td>
                      <td>{u.assignedTasks}</td>
                      <td>
                        {u.email !== currentEmail && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-outline btn-sm" onClick={() => demote(u.id)}>
                              Demote
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => remove(u.id)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Members Table */}
        <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>
          Members <span className="badge badge-member" style={{ marginLeft: 8 }}>{members.length}</span>
        </h3>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {members.length === 0
            ? <p className="empty">No members found.</p>
            : (
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Tasks</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(u => (
                    <tr key={u.id}>
                      <td style={{ color: '#aaa' }}>{u.id}</td>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td><span className="badge badge-member">MEMBER</span></td>
                      <td>{u.assignedTasks}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => promote(u.id)}>
                            Promote
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => remove(u.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </>
  );
}
