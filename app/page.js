"use client"; import { useState, useEffect } from "react";

export default function Home() { const [page, setPage] = useState("home"); const [anim, setAnim] = useState(false);

const [examName, setExamName] = useState(""); const [subjectCount, setSubjectCount] = useState("");

const [students, setStudents] = useState([]);

const [name, setName] = useState(""); const [roll, setRoll] = useState(""); const [marks, setMarks] = useState([]); const [viewStudent, setViewStudent] = useState(null); const [searchRoll, setSearchRoll] = useState("");

useEffect(() => { const data = localStorage.getItem("students"); if (data) setStudents(JSON.parse(data)); }, []);

useEffect(() => { localStorage.setItem("students", JSON.stringify(students)); }, [students]);

const go = (p) => { setAnim(true); setTimeout(() => { setPage(p); setAnim(false); }, 250); };

const gp = (m) => (m >= 80 ? 5 : m >= 70 ? 4 : m >= 60 ? 3.5 : m >= 50 ? 3 : m >= 40 ? 2 : m >= 33 ? 1 : 0); const grade = (g) => (g === 5 ? "A+" : g >= 4 ? "A" : g >= 3.5 ? "A-" : g >= 3 ? "B" : g >= 2 ? "C" : g >= 1 ? "D" : "F");

const start = () => { if (!examName || !subjectCount) return alert("Fill all"); setMarks(Array(Number(subjectCount)).fill("")); go("app"); };

const updateMark = (i, v) => { if (v === "") return; if (v > 100 || v < 0) return alert("0-100 only"); const c = [...marks]; c[i] = v; setMarks(c); };

const addStudent = () => { const nums = marks.map(Number); if (!name || !roll || nums.some((m) => isNaN(m))) return alert("Fill all fields");

const total = nums.reduce((a, b) => a + b, 0);
const fail = nums.some((m) => m < 33);
const gpa = fail ? 0 : nums.reduce((a, b) => a + gp(b), 0) / nums.length;

const obj = { name, roll, total, gpa: +gpa.toFixed(2), grade: grade(gpa), status: fail ? "FAIL" : "PASS" };

const exist = students.find((s) => s.roll === roll);
if (exist) {
  if (!confirm("Already exists. Update?")) return;
  setStudents(students.map((s) => (s.roll === roll ? obj : s)));
} else setStudents([...students, obj]);

setViewStudent(obj);
setName(""); setRoll("");
setMarks(Array(Number(subjectCount)).fill(""));

};

const search = () => { const s = students.find((x) => x.roll === searchRoll); setViewStudent(s); };

const sorted = [...students].sort((a, b) => b.gpa - a.gpa || b.total - a.total || a.roll - b.roll);

return ( <div style={styles.bg}>

{/* NAV BAR */}
  <div style={styles.nav}>
    {[
      { p: "home", icon: "🏠" },
      { p: "setup", icon: "⚙️" },
      { p: "app", icon: "📘" },
      { p: "summary", icon: "📊" },
      { p: "merit", icon: "🏆" }
    ].map((n, i) => (
      <button type="button" key={i} style={styles.navBtn} onClick={() => go(n.p)}>
        {n.icon}
      </button>
    ))}
  </div>

  {/* PAGE TRANSITION */}
  <div style={{
    transform: anim ? "scale(0.94) translateY(30px)" : "scale(1)",
    opacity: anim ? 0 : 1,
    transition: "0.4s cubic-bezier(.4,2,.6,1)"
  }}>

    {/* HOME */}
    {page === "home" && (
      <div style={styles.center}>
        <h1 style={styles.title}>GPA Manager</h1>
        <div style={styles.cardBtn} onClick={() => go("setup")}>➕ Create New Project</div>
        <div style={styles.cardBtn} onClick={() => go("app")}>📂 Previous Projects</div>
      </div>
    )}

    {/* SETUP */}
    {page === "setup" && (
      <div style={styles.card}>
        <h2>Setup</h2>
        <input placeholder="Exam Name" value={examName} onChange={(e)=>setExamName(e.target.value)} />
        <input placeholder="Number of Subjects" value={subjectCount} onChange={(e)=>setSubjectCount(e.target.value)} />
        <button type="button" style={styles.primary} onClick={start}>Start</button>
      </div>
    )}

    {/* APP */}
    {page === "app" && (
      <div style={styles.card}>
        <h2>{examName || "Class"}</h2>

        <input placeholder="Student Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input placeholder="Roll" value={roll} onChange={(e)=>setRoll(e.target.value)} />

        {marks.map((m,i)=>(
          <input key={i} type="number" value={m} placeholder={`Subject ${i+1}`} onChange={(e)=>updateMark(i,e.target.value)} />
        ))}

        <button type="button" style={styles.primary} onClick={addStudent}>Add Student</button>

        <input placeholder="Search by Roll" value={searchRoll} onChange={(e)=>setSearchRoll(e.target.value)} />
        <button type="button" style={styles.secondary} onClick={search}>Search</button>

        {viewStudent && (
          <div style={{...styles.result, borderLeft: viewStudent.status === "PASS" ? "4px solid #22c55e" : "4px solid #ef4444"}}>
            <h3>{viewStudent.name}</h3>
            <p>Roll: {viewStudent.roll}</p>
            <p>Total: {viewStudent.total}</p>
            <p>GPA: {viewStudent.gpa}</p>
            <p>{viewStudent.grade} ({viewStudent.status})</p>
          </div>
        )}
      </div>
    )}

    {/* SUMMARY */}
    {page === "summary" && (
      <div style={styles.card}>
        <h2>Summary</h2>
        <p>Total Students: {students.length}</p>
        <p>Pass: {students.filter(s=>s.status==="PASS").length}</p>
        <p>Fail: {students.filter(s=>s.status==="FAIL").length}</p>
      </div>
    )}

    {/* MERIT */}
    {page === "merit" && (
      <div style={styles.card}>
        <h2>Merit List</h2>
        {sorted.map((s,i)=> (
          <div key={s.roll} style={styles.row}>#{i+1} {s.name} ({s.roll})</div>
        ))}
      </div>
    )}

  </div>
</div>

); }

const styles = { bg:{minHeight:"100vh",padding:20,background:"linear-gradient(135deg,#0f172a,#020617)",color:"#e2e8f0"}, title:{fontSize:32,fontWeight:"bold"}, center:{textAlign:"center"},

card:{padding:20,borderRadius:20,background:"rgba(255,255,255,0.08)",backdropFilter:"blur(20px)",boxShadow:"0 8px 25px rgba(0,0,0,0.3)"},

cardBtn:{margin:"12px auto",padding:18,maxWidth:280,borderRadius:20,background:"rgba(255,255,255,0.1)",cursor:"pointer",transition:"0.25s"},

primary:{marginTop:10,padding:12,borderRadius:14,border:"none",background:"linear-gradient(135deg,#3b82f6,#6366f1)",color:"white"},

secondary:{marginTop:10,padding:12,borderRadius:14,border:"1px solid #94a3b8",background:"transparent",color:"white"},

result:{marginTop:12,padding:14,borderRadius:14,background:"rgba(59,130,246,0.2)"},

nav:{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",display:"flex",gap:10,padding:10,borderRadius:20,background:"rgba(255,255,255,0.08)",backdropFilter:"blur(20px)"},

navBtn:{padding:12,borderRadius:12,border:"none",background:"rgba(255,255,255,0.1)",color:"white"},

row:{marginTop:8,padding:10,borderRadius:12,background:"rgba(255,255,255,0.08)"} };
