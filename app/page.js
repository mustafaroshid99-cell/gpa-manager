"use client";

import { useEffect, useState } from "react";

export default function Home() { const [page, setPage] = useState("home"); const [anim, setAnim] = useState(false);

const [examName, setExamName] = useState(""); const [subjectCount, setSubjectCount] = useState(""); const [students, setStudents] = useState([]);

const [name, setName] = useState(""); const [roll, setRoll] = useState(""); const [marks, setMarks] = useState([]); const [viewStudent, setViewStudent] = useState(null); const [searchRoll, setSearchRoll] = useState("");

const [dark, setDark] = useState(true);

// STORAGE useEffect(() => { const s = localStorage.getItem("students"); if (s) setStudents(JSON.parse(s)); }, []);

useEffect(() => { localStorage.setItem("students", JSON.stringify(students)); }, [students]);

// NAV const go = (p) => { setAnim(true); setTimeout(() => { setPage(p); setAnim(false); }, 200); };

// GPA const gp = (m) => (m >= 80 ? 5 : m >= 70 ? 4 : m >= 60 ? 3.5 : m >= 50 ? 3 : m >= 40 ? 2 : m >= 33 ? 1 : 0);

const grade = (g) => (g === 5 ? "A+" : g >= 4 ? "A" : g >= 3.5 ? "A-" : g >= 3 ? "B" : g >= 2 ? "C" : g >= 1 ? "D" : "F");

const start = () => { setMarks(Array(Number(subjectCount)).fill("")); go("app"); };

const updateMark = (i, v) => { if (v > 100 || v < 0) return alert("Marks must be 0–100"); const c = [...marks]; c[i] = v; setMarks(c); };

const addStudent = () => { const nums = marks.map(Number); const total = nums.reduce((a, b) => a + b, 0); const fail = nums.some((m) => m < 33); const gpa = fail ? 0 : nums.reduce((a, b) => a + gp(b), 0) / nums.length;

const obj = { name, roll, total, gpa: Number(gpa.toFixed(2)), grade: grade(gpa), status: fail ? "FAIL" : "PASS" };

const idx = students.findIndex((s) => s.roll === roll);
if (idx !== -1) {
  if (!confirm("Student exists. Update?")) return;
  const copy = [...students];
  copy[idx] = obj;
  setStudents(copy);
} else setStudents([...students, obj]);

setViewStudent(obj);
setName("");
setRoll("");
setMarks(Array(Number(subjectCount)).fill(""));

};

const search = () => { const s = students.find((x) => x.roll === searchRoll); setViewStudent(s || null); };

const merit = [...students] .sort((a, b) => b.gpa - a.gpa || b.total - a.total || a.roll - b.roll) .map((s, i) => ({ ...s, rank: i + 1 }));

const summary = () => { const pass = students.filter((s) => s.status === "PASS").length; const fail = students.length - pass; const rate = ((pass / students.length) * 100 || 0).toFixed(2); return { pass, fail, rate }; };

return ( <div style={dark ? styles.bgDark : styles.bgLight}>

{/* THEME TOGGLE */}
  <button onClick={() => setDark(!dark)} style={styles.themeBtn}>
    {dark ? "🌙" : "☀️"}
  </button>

  {/* DOCK */}
  <div style={styles.dock}>
    <button onClick={() => go("home")} style={styles.dockBtn}>🏠</button>
    <button onClick={() => go("app")} style={styles.dockBtn}>📘</button>
    <button onClick={() => go("summary")} style={styles.dockBtn}>📊</button>
    <button onClick={() => go("merit")} style={styles.dockBtn}>🏆</button>
  </div>

  <div style={{ opacity: anim ? 0 : 1, transform: anim ? "translateX(10px)" : "none", transition: "0.3s" }}>

    {/* HOME */}
    {page === "home" && (
      <div style={styles.center}>
        <h1 style={styles.title}>GPA Manager</h1>

        <div style={styles.bigBtn} onClick={() => go("setup")}>➕ Create Project</div>
        <div style={styles.bigBtn} onClick={() => go("app")}>📂 Previous</div>
      </div>
    )}

    {/* SETUP */}
    {page === "setup" && (
      <div style={styles.card}>
        <input placeholder="Exam Name" value={examName} onChange={(e) => setExamName(e.target.value)} />
        <input placeholder="Subjects" value={subjectCount} onChange={(e) => setSubjectCount(e.target.value)} />
        <button style={styles.primary} onClick={start}>Start</button>
      </div>
    )}

    {/* APP */}
    {page === "app" && (
      <div style={styles.card}>
        <h2>{examName}</h2>

        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Roll" value={roll} onChange={(e) => setRoll(e.target.value)} />

        {marks.map((m, i) => (
          <input key={i} value={m} onChange={(e) => updateMark(i, e.target.value)} placeholder={`Sub ${i + 1}`} />
        ))}

        <button style={styles.primary} onClick={addStudent}>Add</button>

        <input placeholder="Search Roll" value={searchRoll} onChange={(e) => setSearchRoll(e.target.value)} />
        <button style={styles.secondary} onClick={search}>Search</button>

        {viewStudent && (
          <div style={styles.result}>
            <h3>{viewStudent.name}</h3>
            <p>GPA: {viewStudent.gpa}</p>
            <p>Total: {viewStudent.total}</p>
            <p>{viewStudent.grade}</p>
          </div>
        )}
      </div>
    )}

    {/* SUMMARY */}
    {page === "summary" && (
      <div style={styles.card}>
        <h2>Summary</h2>
        <p>Pass: {summary().pass}</p>
        <p>Fail: {summary().fail}</p>
        <p>Rate: {summary().rate}%</p>
      </div>
    )}

    {/* MERIT */}
    {page === "merit" && (
      <div style={styles.card}>
        <h2>Merit</h2>
        {merit.map((s) => (
          <div key={s.roll} style={styles.row}>#{s.rank} {s.name} ({s.roll})</div>
        ))}
      </div>
    )}

  </div>
</div>

); }

const styles = { bgDark: { minHeight: "100vh", padding: 20, background: "#020617", color: "white" }, bgLight: { minHeight: "100vh", padding: 20, background: "#f1f5f9", color: "black" },

title: { fontSize: 32, textAlign: "center", marginBottom: 20 },

center: { textAlign: "center" },

bigBtn: { margin: "10px auto", padding: 20, maxWidth: 260, borderRadius: 20, background: "rgba(255,255,255,0.1)", cursor: "pointer" },

card: { padding: 20, borderRadius: 20, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" },

primary: { marginTop: 10, padding: 10, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#22c55e,#3b82f6)", color: "white" },

secondary: { marginTop: 10, padding: 10, borderRadius: 10, border: "1px solid gray", background: "transparent" },

result: { marginTop: 10, padding: 10, borderRadius: 10, background: "rgba(59,130,246,0.2)" },

dock: { position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10, padding: 10, borderRadius: 20, background: "rgba(255,255,255,0.1)" },

dockBtn: { padding: 10, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.1)", color: "white" },

row: { marginTop: 6, padding: 8, background: "rgba(255,255,255,0.05)", borderRadius: 8 },

themeBtn: { position: "fixed", top: 20, right: 20, padding: 10, borderRadius: "50%", border: "none" } };
