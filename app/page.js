"use client"; import { useState } from "react";

export default function Home() { const [page, setPage] = useState("home"); // home | create | app

const [projects, setProjects] = useState([]); const [activeProject, setActiveProject] = useState(null);

const [examName, setExamName] = useState(""); const [subjectCount, setSubjectCount] = useState("");

const [students, setStudents] = useState([]); const [viewStudent, setViewStudent] = useState(null);

const [name, setName] = useState(""); const [roll, setRoll] = useState(""); const [marks, setMarks] = useState([]);

const [searchRoll, setSearchRoll] = useState(""); const [error, setError] = useState("");

const [showMerit, setShowMerit] = useState(false); const [showSummary, setShowSummary] = useState(false); const [showForm, setShowForm] = useState(true); const [modal, setModal] = useState(false);

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

const updateMark = (i, v) => { const n = Number(v); if (v !== "" && (n < 0 || n > 100)) return setError("Marks 0-100 only"); setError("");

const c = [...marks];
c[i] = v;
setMarks(c);

};

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

const updated = [...students, obj];
setStudents(updated);
setViewStudent(obj);
setModal(true);

setName("");
setRoll("");
setMarks(Array(activeProject.subjectCount).fill(""));

};

const search = () => { const s = students.find(x => String(x.roll) === String(searchRoll)); if (!s) return setError("Not found"); setViewStudent(s); setModal(true); };

const merit = [...students] .sort((a,b)=> b.gpa-a.gpa || b.total-a.total || a.roll-b.roll) .map((s,i)=>({...s,rank:i+1}));

const summary = () => { const pass = students.filter(s=>s.status==="PASS").length; const fail = students.length-pass; return {pass,fail,rate:((pass/students.length)*100||0).toFixed(2)}; };

return ( <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a,#1e293b)",color:"white",fontFamily:"sans-serif"}}>

{/* TOP BAR */}
  <div style={{display:"flex",gap:10,padding:10}}>
    <button onClick={()=>setPage("home")} style={btn()}>Home</button>
    <button onClick={()=>setShowSummary(!showSummary)} style={btn()}>Summary</button>
    <button onClick={()=>setShowMerit(!showMerit)} style={btn()}>Merit</button>
    <button onClick={()=>setModal(true)} style={btn()}>Profile</button>
  </div>

  {/* ERROR */}
  {error && <div style={{color:"red",paddingLeft:10}}>⚠ {error}</div>}

  {/* HOME */}
  {page === "home" && (
    <div style={card()}>
      <h2>📊 GPA Manager Pro</h2>
      <button style={btn()} onClick={()=>setPage("create")}>➕ Create Project</button>

      <h3>Previous</h3>
      {projects.map(p=> (
        <button key={p.id} style={btn()} onClick={()=>{
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
    <div style={card()}>
      <h3>Create Project</h3>
      <input placeholder="Exam Name" value={examName} onChange={e=>setExamName(e.target.value)} />
      <input placeholder="Subjects" value={subjectCount} onChange={e=>setSubjectCount(e.target.value)} />
      <button style={btn()} onClick={startApp}>Start</button>
    </div>
  )}

  {/* APP */}
  {page === "app" && (
    <div>

      {/* FAB */}
      <button onClick={()=>setShowForm(!showForm)} style={fab()}>＋</button>

      {/* FORM */}
      {showForm && (
        <div style={{...card(),transition:"all .4s"}}>
          <h3>Input Student</h3>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Roll" value={roll} onChange={e=>setRoll(e.target.value)} />

          {marks.map((m,i)=>(
            <input key={i} type="number" value={m}
              placeholder={`Sub ${i+1}`}
              onChange={e=>updateMark(i,e.target.value)} />
          ))}

          <button style={btn()} onClick={submitStudent}>Add</button>
        </div>
      )}

      {/* SEARCH */}
      <div style={card()}>
        <input placeholder="Search roll" value={searchRoll} onChange={e=>setSearchRoll(e.target.value)} />
        <button style={btn()} onClick={search}>Search</button>
      </div>

      {/* MERIT */}
      {showMerit && (
        <div style={{...card(),overflowX:"auto"}}>
          <h3>🏆 Merit</h3>
          <table style={{width:"100%",textAlign:"center"}}>
            <thead>
              <tr><th>Rank</th><th>Name</th><th>Roll</th><th>GPA</th><th>Total</th></tr>
            </thead>
            <tbody>
              {merit.map(s=> (
                <tr key={s.id} style={{transition:"all .3s"}}>
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

      {/* SUMMARY */}
      {showSummary && (
        <div style={card()}>
          <h3>Summary</h3>
          <p>Pass: {summary().pass}</p>
          <p>Fail: {summary().fail}</p>
          <p>Rate: {summary().rate}%</p>
        </div>
      )}

    </div>
  )}

  {/* MODAL */}
  {modal && viewStudent && (
    <div style={modalStyle()} onClick={()=>setModal(false)}>
      <div style={modalBox()}>
        <h3>{viewStudent.name}</h3>
        <p>Roll: {viewStudent.roll}</p>
        <p>GPA: {viewStudent.gpa}</p>
        <p>Total: {viewStudent.total}</p>
        <p>Grade: {viewStudent.grade}</p>
        <button style={btn()} onClick={()=>setModal(false)}>Close</button>
      </div>
    </div>
  )}

</div>

);

function btn(){ return { padding:"10px 14px", margin:"5px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#22c55e)", color:"white", cursor:"pointer", fontWeight:"bold" }; }

function card(){ return { margin:10, padding:15, borderRadius:15, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(10px)" }; }

function fab(){ return { position:"fixed", bottom:20, right:20, width:60, height:60, borderRadius:"50%", fontSize:30, border:"none", background:"linear-gradient(135deg,#f59e0b,#ef4444)", color:"white", cursor:"pointer" }; }

function modalStyle(){ return { position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", justifyContent:"center", alignItems:"center" }; }

function modalBox(){ return { padding:20, borderRadius:15, background:"#111827", minWidth:250 }; } }
