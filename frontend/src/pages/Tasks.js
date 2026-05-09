import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

function TaskModal({ projects, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', assigneeId: '', projectId: '' });
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>New Task</h3>
        <div className="form-group">
          <label>Title</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Project</label>
          <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}>
            <option value="">Select project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Assignee User ID</label>
          <input type="number" placeholder="User ID" value={form.assigneeId}
            onChange={e => setForm({ ...form, assigneeId: e.target.value })} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={() => onSave(form)}>Create</button>
        </div>
      </div>
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const role = localStorage.getItem('role');

  const load = async () => {
    if (role === 'ADMIN') {
      // Admin sees all tasks across all projects
      const ps = await api.get('/projects');
      setProjects(ps.data);
      const all = await Promise.all(ps.data.map(p => api.get(`/projects/${p.id}/tasks`)));
      setTasks(all.flatMap(r => r.data));
    } else {
      // Member sees only their assigned tasks
      const res = await api.get('/tasks/my');
      setTasks(res.data);
      const ps = await api.get('/projects');
      setProjects(ps.data);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async form => {
    if (!form.projectId) return;
    await api.post(`/projects/${form.projectId}/tasks`, {
      title: form.title,
      description: form.description,
      dueDate: form.dueDate || null,
      assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
    });
    setShowModal(false);
    load();
  };

  const updateStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/status`, { status });
    load();
  };

  const del = async id => {
    if (window.confirm('Delete task?')) { await api.delete(`/tasks/${id}`); load(); }
  };

  const badge = status => {
    if (status === 'DONE') return 'badge badge-done';
    if (status === 'IN_PROGRESS') return 'badge badge-progress';
    return 'badge badge-todo';
  };

  const filtered = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>{role === 'ADMIN' ? 'All Tasks' : 'My Tasks'}</h1>
          {role === 'ADMIN' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ New Task</button>
          )}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem' }}>
          {['ALL', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {filtered.length === 0
            ? <p className="empty">{role === 'MEMBER' ? 'No tasks assigned to you yet.' : 'No tasks found.'}</p>
            : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Project</th>
                    {role === 'ADMIN' && <th>Assignee</th>}
                    <th>Status</th>
                    <th>Due</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id}>
                      <td>{t.title}</td>
                      <td>{t.projectName}</td>
                      {role === 'ADMIN' && <td>{t.assigneeEmail || '—'}</td>}
                      <td>
                        <span className={badge(t.status)}>{t.status}</span>
                        {t.overdue && <span className="badge badge-overdue" style={{ marginLeft: 6 }}>OVERDUE</span>}
                      </td>
                      <td>{t.dueDate || '—'}</td>
                      <td>
                        <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)}
                          style={{ fontSize: '0.8rem', padding: '3px 6px', borderRadius: 4, border: '1px solid #ccc', marginRight: 8 }}>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {role === 'ADMIN' && (
                          <button className="btn btn-danger btn-sm" onClick={() => del(t.id)}>✕</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
      {showModal && <TaskModal projects={projects} onClose={() => setShowModal(false)} onSave={create} />}
    </>
  );
}
