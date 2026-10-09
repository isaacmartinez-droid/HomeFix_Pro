import { useEffect, useState } from 'react';
import { notificationsApi } from '../services/api';
import NotificationPanel from './NotificationPanel';
export default function NotificationsButton() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let active = true;
    const update = () => notificationsApi.unreadCount().then(data => { if (active) setCount(data.count); }).catch(() => {});
    update();
    const interval = setInterval(update, 60000);
    return () => { active = false; clearInterval(interval); };
  }, []);
  const refresh = async () => {
    const [items, unread] = await Promise.all([notificationsApi.list(), notificationsApi.unreadCount()]);
    setNotifications(items); setCount(unread.count);
  };
  const toggle = async () => {
    setOpen(!open);
    if (!open) { setLoading(true); setError(''); try { await refresh(); } catch (err) { setError(err.message); } finally { setLoading(false); } }
  };
  const mark = async id => { try { await notificationsApi.markRead(id); await refresh(); } catch (err) { setError(err.message); } };
  const markAll = async () => { try { await notificationsApi.markAllRead(); await refresh(); } catch (err) { setError(err.message); } };
  return <div>
    <button aria-label="Notificaciones" aria-expanded={open} onClick={toggle} className="relative p-2 rounded-full hover:bg-slate-100">
      <span className="material-symbols-outlined">notifications</span>{count > 0 && <span className="absolute -top-1 right-0 rounded-full bg-red-600 px-1 text-xs text-white">{count}</span>}
    </button>
    {open && <NotificationPanel notifications={notifications} loading={loading} error={error} onMarkRead={mark} onMarkAllRead={markAll} onClose={() => setOpen(false)} />}
  </div>;
}
