import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

const styles = {
  page: { maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'monospace' },
  greeting: { fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem', color: '#000' },
  sub: { fontSize: '0.85rem', color: '#888', marginBottom: '2rem' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '2rem' },
  statBox: { border: '1px solid #000', padding: '1rem', textAlign: 'center' },
  statNum: { fontSize: '2rem', fontWeight: 700, color: '#000' },
  statLabel: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1, color: '#555', marginTop: 4 },
  overdueBox: { border: '1px solid #000', padding: '1rem', textAlign: 'center', background: '#000' },
  overdueNum: { fontSize: '2rem', fontWeight: 700, color: '#fff' },
  overdueLabel: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1, color: '#aaa', marginTop: 4 },
  section: { marginBottom: '2rem' },
  sectionTitle: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 2, color: '#000', fontWeight: 700, borderBottom: '2px solid #000', paddingBottom: 6, marginBottom: '1rem' },
  projectCard: { border: '1px solid #ddd', marginBottom: 12 },
  projectHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', cursor: 'pointer', background: '#fafafa' },
  projectName: { fontWeight: 700, fontSize: '0.95rem', color: '#000' },
  projectMeta: { fontSize: '0.75rem', color: '#888', marginTop: 2 },
  projectToggle: { fontSize: '0.75rem', color: '#555', userSelect: 'none' },
  taskList: { borderTop: '1px solid #eee' },
  taskRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', borderBottom: '1px solid #f0f0f0' },
  taskTitle: { fontSize: '0.85rem', color: '#000', fontWeight: 600 },
  taskDesc: { fontSize: '0.75rem', color: '#888', marginTop: 2 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { textAlign: 'left', padding: '8px 10px', borderBottom: '2px solid #000', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 },
  td: { padding: '10px', borderBottom: '1px solid #eee', color: '#222' },
  badge: (status) => ({
    display: 'inline-block', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: 1,
    border: '1px solid #000',
    background: status === 'DONE' ? '#000' : '#fff',
    color: status === 'DONE' ? '#fff' : '#000',
  }),
  overduePill: { display: 'inline-block', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, background: '#000', color: '#fff', marginLeft: 6 },
  statusSelect: { fontSize: '0.8rem', padding: '3px 6px', border: '1px solid #000', background: '#fff', cursor: 'pointer' },
  empty: { color: '#aaa', fontSize: '0.85rem', padding: '1rem 0' },
  filterRow: { display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' },
  filterBtn: (active) => ({ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, border: '1px solid #000', background: active ? '#000' : '#fff', color: active ? '#fff' : '#000', cursor: 'pointer' }),
};

function ProjectCard({ project, tasks, onUpdateStatus }) {
  const [open, setOpen] = useState(true);
  const projectTasks = tasks.filter(t => t.projectName === project.name);

  return (
    <div style={styles.projectCard}>
      <div style={styles.projectHeader} onClick={() => setOpen(o => !o)}>
        <div>
          <div style={styles.projectName}>{project.name}</div>
          <div style={styles.projectMeta}>{project.description || 'No description'} · {projectTasks.length} tasks · {project.memberCount} members</div>
        </div>
        <span style={styles.projectToggle}>{open ? '▲ collapse' : '▼ expand'}</span>
      </div>
      {open && (
        <div style={styles.taskList}>
          {projectTasks.length === 0
            ? <div style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#aaa' }}>No tasks assigned in this project.</div>
            : projectTasks.map(t => (
              <div key={t.id} style={styles.taskRow}>
                <div style={{ flex: 1 }}>
                  <div style={styles.taskTitle}>{t.title}</div>
                  {t.description && <div style={styles.taskDesc}>{t.description}</div>}
                  <div style={{ marginTop: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={styles.badge(t.status)}>{t.status.replace('_', ' ')}</span>
                    {t.overdue && <span style={styles.overduePill}>OVERDUE</span>}
                    {t.dueDate && <span style={{ fontSize: '0.72rem', color: '#888' }}>due {t.dueDate}</span>}
                  </div>
                </div>
                <select style={{ ...styles.statusSelect, marginLeft: 12 }} value={t.status} onChange={e => onUpdateStatus(t.id, e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const email = token ? JSON.parse(atob(token.split('.')[1])).sub : '';
  const name = email.split('@')[0];

  const load = () => Promise.all([api.get('/dashboard'), api.get('/projects')])
    .then(([d, p]) => { setData(d.data); setProjects(p.data); })
    .catch(() => setError('Failed to load dashboard'))
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const updateStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/status`, { status });
    const d = await api.get('/dashboard');
    setData(d.data);
  };

  const filtered = !data ? [] : filter === 'ALL' ? data.tasks : data.tasks.filter(t => t.status === filter);

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        {loading && <p style={styles.empty}>Loading...</p>}
        {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}
        {data && (
          <>
            {/* Greeting */}
            <div style={styles.greeting}>Hello, {name}</div>
            <div style={styles.sub}>{role} · {email}</div>

            {/* Stats */}
            <div style={styles.statsRow}>
              <div style={styles.statBox}>
                <div style={styles.statNum}>{data.totalTasks}</div>
                <div style={styles.statLabel}>Total Tasks</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNum}>{data.todo}</div>
                <div style={styles.statLabel}>To Do</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNum}>{data.inProgress}</div>
                <div style={styles.statLabel}>In Progress</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNum}>{data.completed}</div>
                <div style={styles.statLabel}>Done</div>
              </div>
              {data.overdue > 0 && (
                <div style={styles.overdueBox}>
                  <div style={styles.overdueNum}>{data.overdue}</div>
                  <div style={styles.overdueLabel}>Overdue</div>
                </div>
              )}
            </div>

            {/* Projects with tasks */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>My Projects & Tasks</div>
              {projects.length === 0
                ? <p style={styles.empty}>No projects assigned.</p>
                : projects.map(p => (
                  <ProjectCard key={p.id} project={p} tasks={data.tasks} onUpdateStatus={updateStatus} />
                ))
              }
            </div>

            {/* All Tasks filtered */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>All My Tasks</div>
              <div style={styles.filterRow}>
                {['ALL', ...STATUSES].map(s => (
                  <button key={s} style={styles.filterBtn(filter === s)} onClick={() => setFilter(s)}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
              {filtered.length === 0
                ? <p style={styles.empty}>No tasks found.</p>
                : (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Task</th>
                        <th style={styles.th}>Project</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Due</th>
                        <th style={styles.th}>Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(t => (
                        <tr key={t.id}>
                          <td style={styles.td}>
                            <strong>{t.title}</strong>
                            {t.description && <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 2 }}>{t.description}</div>}
                          </td>
                          <td style={styles.td}>{t.projectName}</td>
                          <td style={styles.td}>
                            <span style={styles.badge(t.status)}>{t.status.replace('_', ' ')}</span>
                            {t.overdue && <span style={styles.overduePill}>OVERDUE</span>}
                          </td>
                          <td style={styles.td}>{t.dueDate || '—'}</td>
                          <td style={styles.td}>
                            <select style={styles.statusSelect} value={t.status} onChange={e => updateStatus(t.id, e.target.value)}>
                              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                          </td>
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
