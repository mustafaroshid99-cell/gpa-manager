"use client"; import { useState, useEffect } from "react";

export default function Home() { const [page, setPage] = useState("home"); const [anim, setAnim] = useState(false);

const [examName, setExamName] = useState(""); const [subjectCount, setSubjectCount] = useState("");

const [students, setStudents] = useState([]);

const [name, setName] = useState(""); const [roll, setRoll] = useState(""); const [marks, setMarks] = useState([]);

const [viewStudent, setViewStudent] = useState(null); const [searchRoll, setSearchRoll] = useState("");

useEffect(() => { const data = localStorage.getItem("students"); if (data) setStudents(JSON.parse(data)); }, []);

useEffect(() => { localStorage.setItem("students", JSON.stringify(students)); }, [students]);

const ripple = (e) => { const btn = e.currentTarget; const circle = document.createElement("span"); const size = Math.max(btn.clientWidth, btn.clientHeight); const rect = btn.getBoundingClientRect();

circle.style.width = circle.style.height = size + "px";
circle.style.left = (e.clientX - rect.left - size / 2) + "px";
circle.style.top = (e.clientY - rect.top - size / 2) + "px";
circle.className = "ripple";

const old = btn.querySelector(".ripple");
if (old) old.remove();
btn.appendChild(circle);

};

const go = (p) => { setAnim(true); setTimeout(() => { setPage(p); setAnim(false); }, 220); };

const gp = (m) => (m >= 80 ? 5 : m >= 70 ? 4 : m >= 60 ? 3.5 : m >= 50 ? 3 : m >= 40 ? 2 : m >= 33 ? 1 : 0);

const grade = (g) => (g === 5 ? "A+" : g >= 4 ? "A" : g >= 3.5 ? "A-" : g >= 3 ? "B" : g >= 2 ? "C" : g >= 1 ? "D" : "F");

const start = () => { if (!examName || !subjectCount) return alert("Fill all fields"); setMarks(Array(Number(subjectCount)).fill("")); go("app"); };

const updateMark = (i, v) => { if (v === "") return; if (Number(v) < 0 || Number(v) > 100) return alert("Marks must be 0-100"); const c = [...marks]; c[i] = v; setMarks(c); };

const addStudent = () => { const nums = marks.map(Number); if (!name || !roll || nums.some((m) => isNaN(m))) return alert("Fill all fields");

const total = nums.reduce((a, b) => a + b, 0);
const fail = nums.some((m) => m < 33);
const gpa = fail ? 0 : nums.reduce((a, b) => a + gp(b), 0) / nums.length;

const obj = {
  name,
  roll: String(roll),
  total,
  gpa: +gpa.toFixed(2),
  grade: grade(gpa),
  status: fail ? "FAIL" : "PASS"
};

const exist = students.find((s) => s.roll === obj.roll);
if (exist) {
  if (!confirm("Student exists. Update marks?")) return;
  setStudents(students.map((s) => (s.roll === obj.roll ? obj : s)));
} else {
  setStudents([...students, obj]);
}

setViewStudent(obj);
setName("");
setRoll("");
setMarks(Array(Number(subjectCount)).fill(""));

};

const search = () => { const s = students.find((x) => x.roll === String(searchRoll)); setViewStudent(s || null); };

const ranked = [...students] .sort((a, b) => (b.gpa - a.gpa) || (b.total - a.total) || (Number(a.roll) - Number(b.roll)) ) .map((s, i) => ({ ...s, merit: i + 1 }));

const byRoll = [...students].sort((a, b) => Number(a.roll) - Number(b.roll));

const printPDF = () => window.print();

const passCount = students.filter(s => s.status === "PASS").length; const failCount = students.filter(s => s.status === "FAIL").length;

const gradeCount = (g) => students.filter(s => s.grade === g).length;

return ( <div style={styles.bg}>

<style>{`
    .ripple{position:absolute;border-radius:50%;transform:scale(0);animation:ripple .6s linear;background:rgba(255,255,255,.4)}
    @keyframes ripple{to{transform:scale(4);opacity:0}}

    .cardPop{animation:pop .3s ease}
    @keyframes pop{from{transform:scale(.96);opacity:.5}to{transform:scale(1);opacity:1}}

    input{margin-top:8px;width:100%;padding:10px;border-radius:12px;border:none;background:rgba(255,255,255,0.1);color:white;outline:none}
  `}</style>

  <div style={styles.nav}>
    {["🏠","⚙️","📘","📊","🏆"].map((ic,i)=>(
      <button key={i} type="button" style={styles.navBtn} onClick={(e)=>{ripple(e);go(["home","setup","app","summary","merit"][i]);}}>{ic}</button>
    ))}
  </div>

  <div className={anim ? "cardPop" : ""}>

    {page === "home" && (
      <div style={styles.center}>
        <h1 style={styles.title}>GPA GOD MODE 2.0</h1>
        <div style={styles.cardBtn} onClick={(e)=>{ripple(e);go("setup");}}>➕ Create Project</div>
        <div style={styles.cardBtn} onClick={(e)=>{ripple(e);go("app");}}>📂 Continue</div>
      </div>
    )}

    {page === "setup" && (
      <div style={styles.card}>
        <h2>Setup</h2>
        <input placeholder="Exam Name" value={examName} onChange={e=>setExamName(e.target.value)} />
        <input placeholder="Subjects" value={subjectCount} onChange={e=>setSubjectCount(e.target.value)} />
        <button type="button" style={styles.primary} onClick={(e)=>{ripple(e);start();}}>Start</button>
      </div>
    )}

    {page === "app" && (
      <div style={styles.card}>
        <h2>{examName}</h2>

        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Roll" value={roll} onChange={e=>setRoll(e.target.value)} />

        {marks.map((m,i)=>(
          <input key={i} type="number" value={m} placeholder={`Sub ${i+1}`} onChange={e=>updateMark(i,e.target.value)} />
        ))}

        <button type="button" style={styles.primary} onClick={(e)=>{ripple(e);addStudent();}}>Add Student</button>

        <input placeholder="Search Roll" value={searchRoll} onChange={e=>setSearchRoll(e.target.value)} />
        <button type="button" style={styles.secondary} onClick={(e)=>{ripple(e);search();}}>Search</button>

        {viewStudent && (
          <div style={styles.result}>
            <h3>{viewStudent.name}</h3>
            <p>Roll: {viewStudent.roll}</p>
            <p>Total: {viewStudent.total}</p>
            <p>GPA: {viewStudent.gpa}</p>
            <p>{viewStudent.grade} ({viewStudent.status})</p>
          </div>
        )}
      </div>
    )}

    {page === "summary" && (
      <div style={styles.card}>
        <h2>Summary</h2>
        <p>Pass: {passCount} | Fail: {failCount}</p>
        <p>A+: {gradeCount("A+")} | A: {gradeCount("A")} | A-: {gradeCount("A-")}</p>
      </div>
    )}

    {page === "merit" && (
      <div style={styles.card}>
        <h2>Merit Table</h2>
        <button type="button" style={styles.primary} onClick={printPDF}>Export PDF</button>

        <div style={styles.tableHead}>
          <span>Name</span><span>Roll</span><span>Merit</span><span>Total</span><span>GPA</span><span>LG</span>
        </div>

        {byRoll.map((s)=>{
          const m = ranked.find(r=>r.roll===s.roll)?.merit;
          return (
            <div key={s.roll} style={styles.tableRow}>
              <span>{s.name}</span>
              <span>{s.roll}</span>
              <span>{m}</span>
              <span>{s.total}</span>
              <span>{s.gpa}</span>
              <span>{s.grade}</span>
            </div>
          );
        })}
      </div>
    )}

  </div>
</div>

); }

const styles = { bg:{minHeight:"100vh",padding:20,background:"radial-gradient(circle at top,#0f172a,#020617)",color:"white"}, center:{textAlign:"center"}, title:{fontSize:36,fontWeight:"bold"},

card:{padding:20,borderRadius:24,background:"rgba(255,255,255,0.08)",backdropFilter:"blur(20px)"}, cardBtn:{margin:"12px auto",padding:18,maxWidth:320,borderRadius:22,background:"rgba(255,255,255,0.1)"},

primary:{marginTop:10,padding:12,borderRadius:14,border:"none",background:"linear-gradient(135deg,#6366f1,#3b82f6)",color:"white"}, secondary:{marginTop:10,padding:12,borderRadius:14,border:"1px solid #94a3b8",background:"transparent",color:"white"},

result:{marginTop:12,padding:14,borderRadius:14,background:"rgba(59,130,246,0.2)"},

nav:{position:"fixed",bottom:18,left:"50%",transform:"translateX(-50%)",display:"flex",gap:10}, navBtn:{padding:12,borderRadius:14,border:"none",background:"rgba(255,255,255,0.1)",color:"white",position:"relative",overflow:"hidden"},

tableHead:{display:"grid",gridTemplateColumns:"repeat(6,1fr)",marginTop:10,fontWeight:"bold"}, tableRow:{display:"grid",gridTemplateColumns:"repeat(6,1fr)",marginTop:6,padding:8,borderRadius:10,background:"rgba(255,255,255,0.08)"} };
