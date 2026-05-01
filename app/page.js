"use client"; import { useState } from "react";

export default function Home() { const [page, setPage] = useState("home"); // home | create | app

const [projects, setProjects] = useState([]); const [activeProject, setActiveProject] = useState(null);

const [examName, setExamName] = useState(""); const [subjectCount, setSubjectCount] = useState("");

const [students, setStudents] = useState([]); const [viewStudent, setViewStudent] = useState(null);

const [name, setName] = useState(""); const [roll, setRoll] = useState(""); const [marks, setMarks] = useState([]);

const [searchRoll, setSearchRoll] = useState(""); const [error, setError] = useState("");

const [showMerit, setShowMerit] = useState(false); const [showSummary, setShowSummary] = useState(false);

const theme = "dark";

const gp = (m) => { if (m >= 80) return 5; if (m >= 70) return 4; if (m >= 60) return 3.5; if (m >= 50) return 3; if (m >= 40) return 2; if (m >= 33) return 1; return 0; };

const grade = (g) => { if (g === 5) return "A+"; if (g >= 4) return "A"; if (g >= 3.5) return "A-"; if (g >= 3) return "B"; if (g >= 2) return "C"; if (g >= 1) return "D"; return "F"; };

const startApp = () => { if (!examName || !subjectCount) return setError("Fill all fields"); setMarks(Array(Number(subjectCount)).fill(""));

const proj = {
  id: Date.now(),
  examName,
  subjectCount: Number(subjectCount),
  students: []
};

setProjects([...projects, proj]);
setActiveProject(proj);
setStudents([]);
setPage("app");
setError("");

};

const updateMark = (i, v) => { const n = Number(v); if (v !== "" && (n < 0 || n > 100)) return setError("Marks 0-100 only"); setError(""); const c = [...marks]; c[i] = v; setMarks(c); };

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

const existingIndex = students.findIndex(s => String(s.roll) === String(roll));

if (existingIndex !== -1) {
  const ok = confirm("Student exists. Update marks?");
  if (!ok) return;
  const updated = [...students];
  updated[existingIndex] = obj;
  setStudents(updated);
  setViewStudent(obj);
} else {
  setStudents([...students, obj]);
  setViewStudent(obj);
}

setName("");
setRoll("");
setMarks(Array(Number(activeProject.subjectCount)).fill(""));

};

const search = () => { const s = students.find(x => String(x.roll) === String(searchRoll)); if (!s) return setError("Not found"); setViewStudent(s); };

const merit = [...students] .sort((a,b)=> b.gpa-a.gpa || b.total-a.total || a.roll-b.roll) .map((s,i)=>({...s,rank:i+1}));

const summary = () => { const pass = students.filter(s=>s.status==="PASS").length; const fail = students.length-pass; return {pass,fail,rate:((pass/students.length)*100||0).toFixed(2)}; };

return ( <div style={styles.bg}>

{/* HEADER */}
  <div style={styles.topBar}>
    <button onClick={()=>setPage("home")} style={styles.btn}>Home</button>
    <button onClick={()=>setShowSummary(!showSummary)} style={styles.btn}>Summary</button>
    <button onClick={()=>setShowMerit(!showMerit)} style={styles.btn}>Merit</button>
  </div>

  {/* HOME */}
  {page === "home" && (
    <div style={styles.glass}>
      <h2>📊 GPA Manager Pro</h2>
      <button style={styles.btn} onClick={()=>setPage("create")}>➕ New Project</button>

      <h3>Previous Projects</h3>
      {projects.map(p=> (
        <button key={p.id} style={styles.btn} onClick={()=>{
          setActiveProject(p);
          setStudents(p.students||[]);
          setPage("app");
        }}>
          {p.examName}
        </button>
      ))}
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
    <div>

      {/* glass wave divider */}
      <div style={styles.wave}></div>

      {/* INPUT */}
      <div style={styles.glass}>
        <h3>Student Input</h3>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Roll" value={roll} onChange={e=>setRoll(e.target.value)} />

        {marks.map((m,i)=>(
          <input key={i} type="number" value={m}
            placeholder={`Sub ${i+1}`}
            onChange={e=>updateMark(i,e.target.value)} />
        ))}

        <button style={styles.btn} onClick={submitStudent}>Add Student</button>
      </div>

      {/* SEARCH */}
      <div style={styles.glass}>
        <input placeholder="Search roll" value={searchRoll} onChange={e=>setSearchRoll(e.target.value)} />
        <button style={styles.btn} onClick={search}>Search</button>
      </div>

      {/* INDIVIDUAL INLINE (NO POPUP) */}
      {viewStudent && (
        <div style={{...styles.glass,transform:"scale(1)",transition:"0.4s"}}>
          <h3>👤 Individual Result</h3>
          <p>{viewStudent.name} (Roll {viewStudent.roll})</p>
          <p>GPA: {viewStudent.gpa}</p>
          <p>Total: {viewStudent.total}</p>
          <p>Grade: {viewStudent.grade}</p>
        </div>
      )}

      {/* SUMMARY */}
      {showSummary && (
        <div style={styles.glass}>
          <h3>Summary</h3>
          <p>Pass: {summary().pass}</p>
          <p>Fail: {summary().fail}</p>
          <p>Rate: {summary().rate}%</p>
        </div>
      )}

      {/* MERIT */}
      {showMerit && (
        <div style={{...styles.glass,overflowX:"auto"}}>
          <h3>🏆 Merit List</h3>
          <table style={{width:"100%",textAlign:"center"}}>
            <thead>
              <tr><th>Rank</th><th>Name</th><th>Roll</th><th>GPA</th><th>Total</th></tr>
            </thead>
            <tbody>
              {merit.map(s=> (
                <tr key={s.id} style={{transition:"0.3s"}}>
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
  )}

</div>

); }

const styles = { bg: { minHeight:"100vh", background:"linear-gradient(135deg,#0f172a,#1e293b,#0b1220)", color:"white", fontFamily:"sans-serif", padding:20 }, glass: { margin:10, padding:15, borderRadius:20, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(18px)", border:"1px solid rgba(255,255,255,0.15)", boxShadow:"0 10px 30px rgba(0,0,0,0.3)" }, btn: { padding:"10px 14px", margin:5, borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#22c55e)", color:"white", fontWeight:"bold", cursor:"pointer" }, topBar: { display:"flex", gap:10, marginBottom:10 }, wave: { height:40, background:"linear-gradient(135deg,rgba(255,255,255,0.1),transparent)", borderRadius:"50px", margin:"10px 0" } };
