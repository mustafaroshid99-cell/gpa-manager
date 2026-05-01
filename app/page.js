"use client"; import { useState } from "react";

export default function Home() { const [page, setPage] = useState("home"); // home | create | app | summary | merit const [anim, setAnim] = useState(false);

const [projects, setProjects] = useState([]); const [activeProject, setActiveProject] = useState(null);

const [examName, setExamName] = useState(""); const [subjectCount, setSubjectCount] = useState("");

const [students, setStudents] = useState([]); const [viewStudent, setViewStudent] = useState(null);

const [name, setName] = useState(""); const [roll, setRoll] = useState(""); const [marks, setMarks] = useState([]);

const [searchRoll, setSearchRoll] = useState(""); const [error, setError] = useState("");

const gp = (m) => { if (m >= 80) return 5; if (m >= 70) return 4; if (m >= 60) return 3.5; if (m >= 50) return 3; if (m >= 40) return 2; if (m >= 33) return 1; return 0; };

const grade = (g) => { if (g === 5) return "A+"; if (g >= 4) return "A"; if (g >= 3.5) return "A-"; if (g >= 3) return "B"; if (g >= 2) return "C"; if (g >= 1) return "D"; return "F"; };

const navigate = (p) => { setAnim(true); setTimeout(()=>{ setPage(p); setAnim(false); },180); };

const startApp = () => { if (!examName || !subjectCount) return setError("Fill all fields"); setMarks(Array(Number(subjectCount)).fill(""));

const proj = {
  id: Date.now(),
  examName,
  subjectCount: Number(subjectCount)
};

setProjects([...projects, proj]);
setActiveProject(proj);
setStudents([]);
navigate("app");
setError("");

};

const updateMark = (i, v) => { const n = Number(v); if (v !== "" && (n < 0 || n > 100)) return setError("Marks 0-100 only"); const c = [...marks]; c[i] = v; setMarks(c); };

const submitStudent = () => { if (!name || !roll) return setError("Enter name & roll");

const nums = marks.map(Number);
if (nums.some(m => m < 0 || m > 100)) return setError("Invalid marks");

const fail = nums.some(m => m < 33);
const total = nums.reduce((a,b)=>a+b,0);
const gpa = fail ? 0 : nums.reduce((a,b)=>a+gp(b),0)/nums.length;

const obj = {
  id: Date.now(),
  name,
  roll: Number(roll),
  marks: nums,
  total,
  gpa: Number(gpa.toFixed(2)),
  grade: grade(gpa),
  status: fail ? "FAIL" : "PASS"
};

const idx = students.findIndex(s => String(s.roll) === String(roll));

if (idx !== -1) {
  const ok = confirm("Student exists. Update?");
  if (!ok) return;
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
setMarks(Array(activeProject.subjectCount).fill(""));

};

const search = () => { const s = students.find(x => String(x.roll) === String(searchRoll)); if (!s) return setError("Not found"); setViewStudent(s); };

const merit = [...students] .sort((a,b)=> b.gpa-a.gpa || b.total-a.total || a.roll-b.roll) .map((s,i)=>({...s,rank:i+1}));

const summary = () => { const pass = students.filter(s=>s.status==="PASS").length; const fail = students.length-pass; const rate = ((pass/students.length)*100||0).toFixed(2); return {pass,fail,rate}; };

return ( <div style={styles.bg}>

{/* TOP NAV */}
  <div style={styles.nav}>
    <button onClick={()=>navigate("home")} style={styles.btn}>🏠</button>
    <button onClick={()=>navigate("app")} style={styles.btn}>📘</button>
    <button onClick={()=>navigate("summary")} style={styles.btn}>📊</button>
    <button onClick={()=>navigate("merit")} style={styles.btn}>🏆</button>
  </div>

  {/* ANIMATION WRAP */}
  <div style={{opacity:anim?0:1,transform:anim?"scale(0.98)":"scale(1)",transition:"0.2s"}}>

  {/* HOME */}
  {page === "home" && (
    <div style={styles.glass}>
      <h2>🎓 GPA Manager Pro</h2>
      <button style={styles.btn} onClick={()=>navigate("create")}>➕ Create Project</button>
    </div>
  )}

  {/* CREATE */}
  {page === "create" && (
    <div style={styles.glass}>
      <h3>Create Project</h3>
      <input placeholder="Exam Name" value={examName} onChange={e=>setExamName(e.target.value)} />
      <input placeholder="Subjects" value={subjectCount} onChange={e=>setSubjectCount(e.target.value)} />
      <button style={styles.btn} onClick={startApp}>Start</button>
    </div>
  )}

  {/* APP */}
  {page === "app" && (
    <div style={styles.glass}>

      <h3>{activeProject?.examName}</h3>

      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Roll" value={roll} onChange={e=>setRoll(e.target.value)} />

      {marks.map((m,i)=>(
        <input key={i} type="number" value={m}
          placeholder={`Sub ${i+1}`}
          onChange={e=>updateMark(i,e.target.value)} />
      ))}

      <button style={styles.btn} onClick={submitStudent}>Add</button>

      <input placeholder="Search roll" value={searchRoll} onChange={e=>setSearchRoll(e.target.value)} />
      <button style={styles.btn} onClick={search}>Search</button>

      {/* INLINE RESULT */}
      {viewStudent && (
        <div style={styles.card}>
          <h3>👤 Result</h3>
          <p>{viewStudent.name} (Roll {viewStudent.roll})</p>
          <p>GPA: {viewStudent.gpa}</p>
          <p>Total: {viewStudent.total}</p>
          <p>Grade: {viewStudent.grade}</p>
        </div>
      )}

    </div>
  )}

  {/* SUMMARY PAGE */}
  {page === "summary" && (
    <div style={styles.glass}>
      <h2>📊 Summary</h2>
      <p>Pass: {summary().pass}</p>
      <p>Fail: {summary().fail}</p>
      <p>Rate: {summary().rate}%</p>
    </div>
  )}

  {/* MERIT PAGE */}
  {page === "merit" && (
    <div style={styles.glass}>
      <h2>🏆 Merit List</h2>

      <table style={styles.table}>
        <thead>
          <tr><th>Rank</th><th>Name</th><th>Roll</th><th>GPA</th><th>Total</th></tr>
        </thead>
        <tbody>
          {merit.map(s=> (
            <tr key={s.id}>
              <td>{s.rank}</td>
              <td>{s.name}</td>
              <td>{s.roll}</td>
              <td>{s.gpa}</td>
              <td>{s.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  </div>

  {/* CURVED S-BLEND */}
  <svg viewBox="0 0 1440 120" style={styles.wave}>
    <path fill="#1e293b" d="M0,64L80,58.7C160,53,320,43,480,53.3C640,64,800,96,960,96C1120,96,1280,64,1360,48L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
  </svg>

</div>

); }

const styles = { bg:{minHeight:"100vh",background:"linear-gradient(135deg,#0b1220,#0f172a,#020617)",color:"white",fontFamily:"sans-serif",padding:20}, nav:{display:"flex",gap:10,marginBottom:10}, glass:{padding:15,borderRadius:22,background:"rgba(255,255,255,0.08)",backdropFilter:"blur(22px)",border:"1px solid rgba(255,255,255,0.15)",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}, btn:{padding:"10px 14px",margin:5,borderRadius:14,border:"none",background:"linear-gradient(135deg,#6366f1,#22c55e)",color:"white",fontWeight:"bold",cursor:"pointer"}, card:{marginTop:10,padding:15,borderRadius:18,background:"rgba(255,255,255,0.12)"}, table:{width:"100%",textAlign:"center",marginTop:10}, wave:{position:"fixed",bottom:0,left:0,width:"100%"} };
