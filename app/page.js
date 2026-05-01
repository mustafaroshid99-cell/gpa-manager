"use client";

import { useEffect, useState } from "react";

export default function Home() { // NAV / UI STATE const [page, setPage] = useState("home"); const [prevPage, setPrevPage] = useState("home"); const [anim, setAnim] = useState(false);

// DATA const [examName, setExamName] = useState(""); const [subjectCount, setSubjectCount] = useState(""); const [students, setStudents] = useState([]);

// INPUT const [name, setName] = useState(""); const [roll, setRoll] = useState(""); const [marks, setMarks] = useState([]); const [searchRoll, setSearchRoll] = useState(""); const [viewStudent, setViewStudent] = useState(null);

// ---------------- PERSISTENCE ----------------

useEffect(() => { const saved = localStorage.getItem("gpa_students"); if (saved) setStudents(JSON.parse(saved));

const savedExam = localStorage.getItem("gpa_exam");
if (savedExam) setExamName(savedExam);

}, []);

useEffect(() => { localStorage.setItem("gpa_students", JSON.stringify(students)); localStorage.setItem("gpa_exam", examName); }, [students, examName]);

// ---------------- GPA ----------------

const gp = (m) => { if (m >= 80) return 5; if (m >= 70) return 4; if (m >= 60) return 3.5; if (m >= 50) return 3; if (m >= 40) return 2; if (m >= 33) return 1; return 0; };

const grade = (g) => { if (g === 5) return "A+"; if (g >= 4) return "A"; if (g >= 3.5) return "A-"; if (g >= 3) return "B"; if (g >= 2) return "C"; if (g >= 1) return "D"; return "F"; };

// ---------------- NAVIGATION (SLIDE) ----------------

const go = (p) => { setAnim(true); setPrevPage(page);

setTimeout(() => {
  setPage(p);
  setAnim(false);
}, 180);

};

// ---------------- START ----------------

const start = () => { setMarks(Array(Number(subjectCount)).fill("")); go("app"); };

const updateMark = (i, v) => { const c = [...marks]; c[i] = v; setMarks(c); };

// ---------------- ADD STUDENT ----------------

const addStudent = () => { const nums = marks.map(Number);

const total = nums.reduce((a, b) => a + b, 0);
const fail = nums.some((m) => m < 33);

const gpa = fail
  ? 0
  : nums.reduce((a, b) => a + gp(b), 0) / nums.length;

const obj = {
  name,
  roll,
  marks: nums,
  total,
  gpa: Number(gpa.toFixed(2)),
  grade: grade(gpa),
  status: fail ? "FAIL" : "PASS",
};

const idx = students.findIndex((s) => s.roll === roll);

if (idx !== -1) {
  const updated = [...students];
  updated[idx] = obj;
  setStudents(updated);
  setViewStudent(obj);
} else {
  setStudents([...students, obj]);
  setViewStudent(obj);
}

setName("");
setRoll("");
setMarks(Array(Number(subjectCount)).fill(""));

};

// ---------------- SEARCH ----------------

const search = () => { const s = students.find((x) => x.roll === searchRoll); setViewStudent(s || null); };

// ---------------- MERIT ----------------

const merit = [...students] .sort((a, b) => b.gpa - a.gpa || b.total - a.total || a.roll - b.roll) .map((s, i) => ({ ...s, rank: i + 1 }));

// ---------------- SUMMARY ----------------

const summary = () => { const pass = students.filter((s) => s.status === "PASS").length; const fail = students.length - pass; const rate = ((pass / students.length) * 100 || 0).toFixed(2); return { pass, fail, rate }; };

// ---------------- EXPORT ----------------

const exportPDF = () => window.print();

// ---------------- MARKS INPUT ----------------

const ensureMarks = () => { if (marks.length === 0 && subjectCount) { setMarks(Array(Number(subjectCount)).fill("")); } };

// ---------------- UI ----------------

return ( <div style={styles.bg}>

{/* FLOATING DOCK */}
  <div style={styles.dock}>
    <button onClick={() => go("home")} style={styles.dockBtn}>🏠</button>
    <button onClick={() => go("app")} style={styles.dockBtn}>📘</button>
    <button onClick={() => go("summary")} style={styles.dockBtn}>📊</button>
    <button onClick={() => go("merit")} style={styles.dockBtn}>🏆</button>
  </div>

  {/* SLIDE ANIMATION WRAP */}
  <div style={{
    transform: anim ? "translateX(10px) scale(0.98)" : "translateX(0) scale(1)",
    opacity: anim ? 0.4 : 1,
    transition: "0.25s"
  }}>

    {/* HOME */}
    {page === "home" && (
      <div style={styles.hero}>
        <h1 style={styles.title}>🎓 GPA Manager Pro</h1>

        <div style={styles.card}>
          <input placeholder="Exam Name" value={examName} onChange={(e) => setExamName(e.target.value)} />
          <input placeholder="Subjects" value={subjectCount} onChange={(e) => setSubjectCount(e.target.value)} />
          <button style={styles.primaryBtn} onClick={start}>🚀 Create Project</button>
        </div>
      </div>
    )}

    {/* APP */}
    {page === "app" && (
      <div style={styles.card}>
        {ensureMarks()}

        <h2 style={styles.subTitle}>{examName}</h2>

        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Roll" value={roll} onChange={(e) => setRoll(e.target.value)} />

        {marks.map((m, i) => (
          <input key={i} type="number" value={m} placeholder={`Sub ${i + 1}`} onChange={(e) => updateMark(i, e.target.value)} />
        ))}

        <button style={styles.primaryBtn} onClick={addStudent}>➕ Add Student</button>

        <input placeholder="Search Roll" value={searchRoll} onChange={(e) => setSearchRoll(e.target.value)} />
        <button style={styles.secondaryBtn} onClick={search}>🔍 Search</button>

        {viewStudent && (
          <div style={styles.resultCard}>
            <h3>{viewStudent.name}</h3>
            <p>GPA: {viewStudent.gpa}</p>
            <p>Total: {viewStudent.total}</p>
            <p>Grade: {viewStudent.grade}</p>
          </div>
        )}
      </div>
    )}

    {/* SUMMARY */}
    {page === "summary" && (
      <div style={styles.card}>
        <h2>📊 Summary</h2>
        <p>Pass: {summary().pass}</p>
        <p>Fail: {summary().fail}</p>
        <p>Rate: {summary().rate}%</p>
      </div>
    )}

    {/* MERIT */}
    {page === "merit" && (
      <div style={styles.card}>
        <h2>🏆 Merit List</h2>
        <button style={styles.primaryBtn} onClick={exportPDF}>Export PDF</button>

        {merit.map((s) => (
          <div key={s.roll} style={styles.meritRow}>
            #{s.rank} {s.name} (Roll {s.roll}) — GPA {s.gpa}
          </div>
        ))}
      </div>
    )}

  </div>
</div>

); }

// ---------------- STYLES ----------------

const styles = { bg: { minHeight: "100vh", padding: 20, fontFamily: "system-ui", background: "radial-gradient(circle at top,#0f172a,#020617)", color: "white" },

hero: { textAlign: "center" },

title: { fontSize: 30, fontWeight: "bold", background: "linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", color: "transparent" },

subTitle: { color: "#cbd5e1" },

card: { padding: 18, borderRadius: 22, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(25px)", border: "1px solid rgba(255,255,255,0.15)" },

resultCard: { marginTop: 12, padding: 12, borderRadius: 16, background: "rgba(99,102,241,0.15)" },

primaryBtn: { marginTop: 10, padding: 10, borderRadius: 14, border: "none", fontWeight: "bold", color: "white", background: "linear-gradient(135deg,#6366f1,#22c55e)" },

secondaryBtn: { marginTop: 10, padding: 10, borderRadius: 14, border: "1px solid #94a3b8", background: "transparent", color: "white" },

dock: { position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 12, padding: 12, borderRadius: 20, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)" },

dockBtn: { padding: 12, borderRadius: 14, border: "none", background: "rgba(255,255,255,0.1)", color: "white" },

meritRow: { marginTop: 8, padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.08)" } };
