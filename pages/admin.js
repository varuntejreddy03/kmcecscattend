import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicBackground from '../components/CinematicBackground';
import { Upload, FileText, RefreshCw, CheckCircle, AlertTriangle, LogOut, Shield, Activity, Database, Server, Lock, ChevronRight } from 'lucide-react';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [section, setSection] = useState('CSC');
  const [year, setYear] = useState('3');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [batchFiles, setBatchFiles] = useState([]);
  const [syncStatus, setSyncStatus] = useState({});
  const [lastSyncInfo, setLastSyncInfo] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('/last-update.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => setLastSyncInfo(data));
  }, []);

  const sections2 = ['CSE A', 'CSE B', 'CSE C', 'CSM A', 'CSM B', 'CSM C', 'ECE'];
  const sections3 = ['CSE A', 'CSE B', 'CSC', 'CSD', 'CSM', 'CSO', 'ECE'];
  const currentSections = year === '2' ? sections2 : sections3;

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Dimple@123') {
      setIsAdmin(true);
      setMessage({ type: 'success', text: 'Secure Connection Established' });
    } else {
      setMessage({ type: 'error', text: 'Access Denied: Invalid Credentials' });
    }
  };

  const splitCSVLine = (line) => {
    const result = [];
    let cell = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') { cell += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (char === ',' && !inQuotes) {
        result.push(cell);
        cell = '';
      } else {
        cell += char;
      }
    }
    result.push(cell);
    return result;
  };

  const parseCSV = (text, targetYear, targetSection) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return { students: [], subjects: [] };

    const rawHeaders = splitCSVLine(lines[0]).map(h => h.trim().replace(/[="]/g, ''));
    const headers = rawHeaders.map(h => h.toLowerCase());
    const students = [];

    const htIdx = headers.findIndex(h => h.includes('hall') || h.includes('ht') || h.includes('ticket'));
    const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('student'));
    const idIdx = headers.findIndex(h => h.includes('id'));
    const totalIdx = headers.findIndex((h, idx) => (h === 'total' || h === 'total classes') && !rawHeaders[idx].toLowerCase().includes('biometric'));

    const subjectsFound = [];
    const startIndex = Math.max(htIdx, nameIdx, idIdx) + 1;
    const endIndex = totalIdx !== -1 ? totalIdx : headers.length - 4;

    for (let j = startIndex; j < endIndex; j++) {
      const h = rawHeaders[j] || '';
      if (h && !['percentage', 'biometric', 'total', 'attendance'].some(k => h.toLowerCase().includes(k))) {
        subjectsFound.push({ id: 100 + j, name: h.toUpperCase(), idx: j });
      }
    }

    for (let i = 1; i < lines.length; i++) {
      const cols = splitCSVLine(lines[i]);
      if (cols.length < Math.max(htIdx, nameIdx)) continue;

      const attendance = subjectsFound.map(m => {
        const rawVal = cols[m.idx] || '0/0';
        const cleanVal = rawVal.replace(/[^\d/]/g, '').trim();
        return {
          subjectId: m.id,
          subjectName: m.name,
          status: cleanVal.includes('/') ? cleanVal : `${cleanVal || 0}/${cleanVal || 0}`
        };
      });

      const rawTotal = cols[totalIdx] || '';
      const cleanTotal = rawTotal.replace(/[^\d/]/g, '').trim();
      let totalPresent = 0, totalPeriods = 0;

      if (cleanTotal && cleanTotal.includes('/')) {
        [totalPresent, totalPeriods] = cleanTotal.split('/').map(Number);
      } else {
        attendance.forEach(a => {
          const [p, t] = a.status.split('/').map(Number);
          totalPresent += (p || 0); totalPeriods += (t || 1);
        });
      }

      students.push({
        studentId: parseInt(cols[idIdx]?.replace(/\D/g, '')) || (200 + i),
        hallticket: cols[htIdx]?.replace(/[="]/g, '').trim() || '',
        studentName: cols[nameIdx]?.replace(/[="]/g, '').trim() || '',
        section: `${targetSection} ${targetYear}nd Year`,
        attendance,
        totalPresent,
        totalPeriods,
        percentage: totalPeriods > 0 ? ((totalPresent / totalPeriods) * 100).toFixed(2) : "0.00"
      });
    }

    return { students, subjects: subjectsFound };
  };

  const detectMetadata = (fileName) => {
    const upper = fileName.toUpperCase();
    let detectedYear = '3';
    let detectedSection = '';

    if (upper.includes('_2_')) detectedYear = '2';
    else if (upper.includes('_3_')) detectedYear = '3';

    const sections = detectedYear === '2' ? sections2 : sections3;
    const normalizedName = upper.replace(/[\s_]/g, '');

    for (const s of sections) {
      const normalizedSection = s.toUpperCase().replace(/[\s_]/g, '');
      if (normalizedName.includes(normalizedSection)) {
        detectedSection = s;
        break;
      }
    }
    return { year: detectedYear, section: detectedSection };
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    const results = await Promise.all(files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const { year: dy, section: ds } = detectMetadata(file.name);
          const { students, subjects } = parseCSV(ev.target.result, dy, ds);
          resolve({ fileName: file.name, year: dy, section: ds, students, subjects, data: { Error: false, subjectDetails: subjects.map(s => ({ subjectId: s.id, subjectName: s.name })), studentsAttendance: students } });
        };
        reader.readAsText(file);
      });
    }));
    setBatchFiles(results);
    setLoading(false);
  };

  const handleBulkSync = async () => {
    setLoading(true);
    const newStatus = { ...syncStatus };
    for (const file of batchFiles) {
      if (!file.section) {
        newStatus[file.fileName] = 'error';
        continue;
      }
      newStatus[file.fileName] = 'syncing';
      setSyncStatus({ ...newStatus });

      try {
        const res = await fetch('/api/update-attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section: file.section, year: file.year, data: file.data, password })
        });
        newStatus[file.fileName] = res.ok ? 'success' : 'error';
      } catch {
        newStatus[file.fileName] = 'error';
      }
      setSyncStatus({ ...newStatus });
    }
    setLoading(false);
    setMessage({ type: 'success', text: 'Global Sync Completed Successfully' });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-indigo-500/30">
        <Head><title>KMCE Command Center</title></Head>
        <CinematicBackground />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-card/40 backdrop-blur-3xl border border-border p-8 md:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 text-foreground opacity-[0.03] -rotate-12 pointer-events-none">
              <Shield size={180} />
            </div>

            <div className="relative z-10 text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <Lock size={12} />
                Secure Access
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Command Center</h1>
              <p className="text-sm text-muted-foreground font-medium">Authorized Personnel Only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Secure Key</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border-2 border-border rounded-2xl py-4 px-6 text-sm font-bold text-center tracking-widest placeholder:text-muted-foreground focus:border-indigo-500/50 outline-none transition-all"
                  placeholder="••••••••••••"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white p-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
              >
                Authenticate
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-6 p-4 rounded-2xl text-xs font-bold text-center border ${message.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 text-foreground selection:bg-indigo-500/30">
      <Head><title>KMCE Data Command</title></Head>
      <CinematicBackground />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 🚀 Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Database size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none">Data Ingestion Data</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Operational</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAdmin(false)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all text-xs font-black uppercase tracking-widest"
          >
            <LogOut size={14} />
            Termimate Session
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 📂 Main Ingestion Zone */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card/40 backdrop-blur-3xl border border-border rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-foreground opacity-[0.02] -rotate-12 pointer-events-none">
                <Server size={200} />
              </div>

              <div className="relative z-10 mb-8">
                <h2 className="text-xl font-black italic uppercase tracking-tight mb-2">Bulk Ingestion</h2>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Upload Master Data CSVs</p>
              </div>

              <div className="relative group">
                <input
                  type="file"
                  accept=".csv"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                />
                <div className="border-2 border-dashed border-border rounded-[2rem] p-12 text-center group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto bg-background rounded-full flex items-center justify-center mb-6 shadow-lg text-indigo-500 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <h3 className="text-lg font-bold italic mb-2">Drop CSV Files Here</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">or click to browse</p>
                </div>
              </div>

              {batchFiles.length > 0 && (
                <div className="mt-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Activity size={14} className="text-indigo-400" />
                      Processing Queue ({batchFiles.length})
                    </h3>
                    <button onClick={() => setBatchFiles([])} className="text-[10px] font-bold text-rose-400 hover:text-rose-300 uppercase tracking-widest">Clear Queue</button>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                    {batchFiles.map((file, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i}
                        className="bg-background/50 border border-border p-4 rounded-2xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg ${syncStatus[file.fileName] === 'success' ? 'bg-emerald-500' : syncStatus[file.fileName] === 'error' ? 'bg-rose-500' : 'bg-indigo-500'}`}>
                            {syncStatus[file.fileName] === 'success' ? <CheckCircle size={14} /> : syncStatus[file.fileName] === 'error' ? <AlertTriangle size={14} /> : <FileText size={14} />}
                          </div>
                          <div>
                            <p className="text-xs font-bold truncate max-w-[180px] md:max-w-[300px]">{file.fileName}</p>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                              {file.section ? (
                                <span className="text-indigo-400">{file.year}YR • {file.section}</span>
                              ) : (
                                <span className="text-amber-500">⚠ Manual ID Reqd.</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black italic">{file.students.length} <span className="text-[8px] text-muted-foreground font-bold not-italic">RECORDS</span></div>
                          <div className={`text-[8px] font-black uppercase tracking-widest mt-1 ${syncStatus[file.fileName] === 'success' ? 'text-emerald-500' : 'text-indigo-400'}`}>
                            {syncStatus[file.fileName] || 'Pending'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button
                    onClick={handleBulkSync}
                    disabled={loading || batchFiles.length === 0}
                    className={`w-full py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 ${loading ? 'bg-background/50 text-muted-foreground cursor-wait' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-emerald-500/20 active:scale-[0.98]'
                      }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Syncing Protocol...
                      </>
                    ) : (
                      <>
                        <Database size={16} />
                        Initiate Sync
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 🎛️ Control Panel */}
          <div className="space-y-6">
            <div className="bg-card/40 backdrop-blur-3xl border border-border rounded-[2.5rem] p-8 shadow-xl">
              <h3 className="text-sm font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500"><AlertTriangle size={12} /></span>
                Manual Override
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-2 mb-2 block">Target Year</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['2', '3'].map(y => (
                      <button
                        key={y}
                        onClick={() => setYear(y)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all border ${year === y ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-background border-border text-muted-foreground hover:bg-card'}`}
                      >
                        {y}nd Year
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-2 mb-2 block">Target Section</label>
                  <div className="relative">
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl py-4 px-4 text-xs font-bold outline-none appearance-none focus:border-indigo-500/50"
                    >
                      {currentSections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/40 backdrop-blur-3xl border border-border rounded-[2.5rem] p-8 shadow-xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Operations Guide</h4>
              <ul className="space-y-4">
                {[
                  { icon: Upload, text: "Drag & Drop CSV Attendance Files" },
                  { icon: Activity, text: "Wait for auto-metadata detection" },
                  { icon: Database, text: "Execute Sync to push live updates" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-medium text-foreground/80">
                    <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-indigo-400">
                      <item.icon size={10} />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 z-50 pointer-events-none"
            >
              <div className={`bg-card border border-border shadow-2xl p-6 rounded-[1.5rem] flex items-center gap-4 ${message.type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`}>
                <div className={`p-3 rounded-full ${message.type === 'error' ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}>
                  {message.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">System Notification</div>
                  <div className="text-sm font-bold">{message.text}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
