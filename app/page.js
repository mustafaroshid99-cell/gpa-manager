"use client"; import { useState } from "react";

export default function Home() { const [className, setClassName] = useState(""); const [subjectCount, setSubjectCount] = useState(""); const [started, setStarted] = useState(false);

const [name, setName] = useState(""); const [roll, setRoll] = useState(""); const [searchRoll, setSearchRoll] = useState(""); const [error, setError] = useState("");

const [theme, setTheme] = useState("dark"); const [showMerit, setShowMerit] = useState(false); const [showSummary, setShowSummary] = useState(false);

const [viewMode, setViewMode] = useState("home"); // home | profile const [selectedStudent, setSelectedStudent] = useState(null);

const [currentMarks, setCurrentMarks] = useState([]); const [students, setStudents] = useState([]); const [viewIndex, setViewIndex] = useState(-1);

const isDark = theme === "dark";

const bg = isDark ? "#0b1220" : "#f1f5f9"; const card = "rgba(255,255,255,0.08)"; const text = isDark ? "white" : "black";

const btn = { padding: "10px 14px", margin: "5px", borderRadius: 12, border: "none", cursor: "pointer", color: "white", background: "linear-gradient(135deg,#6366f1,#22c55e)", fontWeight: "bold" };

const glass = { background: card, backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 15, transition: "all 0.4s ease" };

const getGP = (m) => { if (m >= 80) return 5.0; if (m >= 70) return 4.0; if (m >= 60) return 3.5; if (m >= 50) return 3.0; if (m >= 40) return 2.0; if (m >= 33) return 1.0; return 0.0; };

const getGrade = (gpa) => { if (gpa === 5) return "A+"; if (gpa >= 4) return "A"; if (gpa >= 3.5) return "A-"; if (gpa >= 3) return "B"; if (gpa >= 2) return "C"; if (gpa >= 1) return "D"; return "F"; };

const start = () => { if (!className || !subjectCount) return alert("Fill all fields"); setCurrentMarks(Array(Number(subjectCount)).fill("")); setStarted(true); };

const updateMark = (i, val) => { const n = Number(val); if (val !== "" && (n < 0 || n > 100)) setError("Marks must be 0-100"); else setError("");

const c = [...currentMarks];
c[i] = val;
setCurrentMarks(c);

};

const submitStudent = () => { setError("");

if (!name || !roll) return setError("Enter name & roll");

const exist = students.find(s => String(s.roll) === String(roll));

const marks = currentMarks.map(Number);
if (marks.some(m => m < 0 || m > 100)) return setError("Marks invalid");

const fail = marks.some(m => m < 33);
const total = marks.reduce((a,b)=>a+b,0);
const gpaRaw = marks.reduce((a,b)=>a+getGP(b),0) / marks.length;
const gpa = fail ? 0 : gpaRaw;

const studentObj = {
  id: exist?.id || Date.now(),
  name,
  roll: Number(roll),
  marks,
  total,
  gpa: Number(gpa.toFixed(2)),
  grade: getGrade(gpa),
  status: fail ? "FAIL" : "PASS"
};

if (exist) {
  const ok = confirm("Student exists. Update?");
  if (!ok) return;
  const updated = students.map(s => s.roll == roll ? studentObj : s);
  setStudents(updated);
  setSelectedStudent(studentObj);
  setViewMode("profile");
  return;
}

const updated = [...students, studentObj];
setStudents(updated);
setSelectedStudent(studentObj);
setViewMode("profile");

setName("");
setRoll("");
setCurrentMarks(Array(Number(subjectCount)).fill(""));

};

const searchStudent = () => { const s = students.find(x => String(x.roll) === String(searchRoll)); if (!s) return setError("Not found"); setSelectedStudent(s); setViewMode("profile"); };

const merit = [...students] .sort((a,b)=> b.gpa-a.gpa || b.total-a.total || a.roll-b.roll) .map((s,i)=>({...s,rank:i+1}));

return ( <div style={{background:bg,minHeight:"100vh",color:text,fontFamily:"sans-serif",paddingBottom:80}}>

{/* TOP BAR */}
  <div>
    <button style={btn} onClick={()=>setTheme(theme==="dark"?"light":"dark")}>Theme</button>
    <button style={btn} onClick={()=>setShowSummary(!showSummary)}>Summary</button>
    <button style={btn} onClick={()=>setShowMerit(!showMerit)}>Merit</button>
  </div>

  {error && <p style={{color:"red",fontWeight:"bold"}}>⚠ {error}</p>}

  {/* INPUT */}
  <div style={glass}>
    <h3>Student Input</h3>
    <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
    <input placeholder="Roll" value={roll} onChange={e=>setRoll(e.target.value)} />

    {currentMarks.map((m,i)=>(
      <input key={i} type="number" placeholder={`Sub ${i+1}`} value={m}
        onChange={e=>updateMark(i,e.target.value)} />
    ))}

    <button style={btn} onClick={submitStudent}>Add</button>
  </div>

  {/* SEARCH */}
  <div style={glass}>
    <input placeholder="Search roll" value={searchRoll} onChange={e=>setSearchRoll(e.target.value)} />
    <button style={btn} onClick={searchStudent}>Search</button>
  </div>

  {/* PROFILE PAGE */}
  {viewMode === "profile" && selectedStudent && (
    <div style={{...glass, animation:"fadeIn .4s ease"}}>
      <h2>Student Profile</h2>
      <h3>{selectedStudent.name} (Roll {selectedStudent.roll})</h3>
      <p>Total: {selectedStudent.total}</p>
      <p>GPA: {selectedStudent.gpa}</p>
      <p>Grade: {selectedStudent.grade}</p>
      <p>Status: {selectedStudent.status}</p>

      <button style={btn} onClick={()=>setViewMode("home")}>Back</button>
    </div>
  )}

  {/* SUMMARY */}
  {showSummary && (
    <div style={glass}>
      <h3>Summary</h3>
      <p>Total Students: {students.length}</p>
      <p>Pass: {students.filter(s=>s.status==="PASS").length}</p>
      <p>Fail: {students.filter(s=>s.status==="FAIL").length}</p>
    </div>
  )}

  {/* MERIT */}
  {showMerit && (
    <div style={{...glass, overflowX:"auto"}}>
      <h3>🏆 Merit List</h3>

      <table style={{width:"100%",textAlign:"center",borderCollapse:"collapse"}}>
        <thead>
          <tr>
            <th>Rank</th><th>Name</th><th>Roll</th><th>GPA</th><th>Total</th>
          </tr>
        </thead>
        <tbody>
          {merit.map(s=> (
            <tr key={s.id} style={{transition:"all .3s ease"}}>
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

  {/* BOTTOM NAV */}
  <div style={{position:"fixed",bottom:0,left:0,right:0,display:"flex",justifyContent:"space-around",background:"#111827",padding:10}}>
    <button style={btn} onClick={()=>setViewMode("home")}>Home</button>
    <button style={btn} onClick={()=>setShowMerit(true)}>Ranks</button>
    <button style={btn} onClick={()=>setShowSummary(true)}>Stats</button>
    <button style={btn} onClick={()=>setTheme(theme==="dark"?"light":"dark")}>Theme</button>
  </div>

</div>

); }
