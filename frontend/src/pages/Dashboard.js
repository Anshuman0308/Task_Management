import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => { api.get('/dashboard').then(r => setData(r.data)); }, []);

  const badge = status => {
    if (status === 'DONE') return 'badge badge-done';
    if (status === 'IN_PROGRESS') return 'badge badge-progress';
    return 'badge badge-todo';
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header"><h1>Dashboard</h1></div>
        {data && (
          <>
            <div className="stats">
              <div className="stat-card"><div className="num">{data.totalTasks}</div><div className="label">Total Tasks</div></div>
              <div className="stat-card"><div className="num">{data.todo}</div><div className="label">To Do</div></div>
              <div className="stat-card"><div className="num">{data.inProgress}</div><div className="label">In Progress</div></div>
              <div className="stat-card"><div className="num">{data.completed}</div><div className="label">Completed</div></div>
              <div className="stat-card overdue"><div className="num">{data.overdue}</div><div className="label">Overdue</div></div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>My Tasks</h3>
              {data.tasks.length === 0
                ? <p className="empty">No tasks assigned yet.</p>
                : (
                  <table>
                    <thead>
                      <tr><th>Title</th><th>Project</th><th>Status</th><th>Due Date</th></tr>
                    </thead>
                    <tbody>
                      {data.tasks.map(t => (
                        <tr key={t.id}>
                          <td>{t.title}</td>
                          <td>{t.projectName}</td>
                          <td><span className={badge(t.status)}>{t.status}</span>
                            {t.overdue && <span className="badge badge-overdue" style={{ marginLeft: 6 }}>OVERDUE</span>}
                          </td>
                          <td>{t.dueDate || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
