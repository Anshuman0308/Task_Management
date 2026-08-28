import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

function Modal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', description: '' });
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>New Project</h3>
        <div className="form-group">
          <label>Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea rows={3} value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={() => onSave(form)}>Create</button>
        </div>
      </div>
    </div>
  );
}

function MemberModal({ projectId, onClose }) {
  const [userId, setUserId] = useState('');
  const [msg, setMsg] = useState('');

  const add = async () => {
    if (!userId) {
      setMsg('Please enter a user ID');
      return;
    }

    try {
      await api.post(`/projects/${projectId}/members`, {
        userId: Number(userId)
      });

      setMsg('Member added!');
    } catch (e) {
      setMsg(e.response?.data?.error || 'Error adding member');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Member</h3>

        <div className="form-group">
          <label>Member ID</label>
          <input
            type="number"
            min="1"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="Enter member ID"
          />
        </div>

        {msg && (
          <p
            style={{
              fontSize: '0.85rem',
              color: msg === 'Member added!' ? 'green' : 'red'
            }}
          >
            {msg}
          </p>
        )}

        <div className="modal-actions">
          <button
            className="btn btn-outline btn-sm"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={add}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [memberModal, setMemberModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const role = localStorage.getItem('role');

  const load = async () => {
    try {
      setLoading(true);
      const r = await api.get('/projects');
      setProjects(r.data);
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async form => {
    try {
      await api.post('/projects', form);
      setShowCreate(false);
      load();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to create project');
    }
  };

  const del = async id => {
    if (window.confirm('Delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        load();
      } catch {
        setError('Failed to delete project');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>Projects</h1>
          {role === 'ADMIN' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>+ New Project</button>
          )}
        </div>
        {loading && <p className="empty">Loading...</p>}
        {error && <p className="error" style={{ marginBottom: '1rem' }}>{error}</p>}
        {!loading && projects.length === 0 && !error && <p className="empty">No projects yet.</p>}
        {projects.map(p => (
          <div className="card" key={p.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3>{p.name}</h3>
                <p style={{ color: '#666', fontSize: '0.88rem', marginTop: 4 }}>{p.description}</p>
                <p style={{ fontSize: '0.8rem', color: '#999', marginTop: 8 }}>
                  Owner: {p.ownerEmail} &nbsp;·&nbsp; {p.memberCount} members &nbsp;·&nbsp; {p.taskCount} tasks
                </p>
              </div>
              {role === 'ADMIN' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setMemberModal(p.id)}>+ Member</button>
                  <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {showCreate && <Modal onClose={() => setShowCreate(false)} onSave={create} />}
      {memberModal && <MemberModal projectId={memberModal} onClose={() => setMemberModal(null)} />}
    </>
  );
}
