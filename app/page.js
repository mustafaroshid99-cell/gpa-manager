"use client"; import { useState } from "react";

export default function Home() { const [className, setClassName] = useState(""); const [subjectCount, setSubjectCount] = useState(""); const [started, setStarted] = useState(false);

const [name, setName] = useState(""); const [roll, setRoll] = useState("");

const [currentMarks, setCurrentMarks] = useState([]); const [students, setStudents] = useState([]);

const [viewIndex, setViewIndex] = useState(-1);

const getGP = (m) => { if (m >= 80) return 5.0; else if (m >= 70) return 4.0; else if (m >= 60) return 3.5; else if (m >= 50) return 3.0; else if (m >= 40) return 2.0; else if (m >= 33) return 1.0; else return 0.0; };

const getGrade = (gpa) => { if (gpa === 5.0) return "A+"; else if (gpa >= 4.0) return "A"; else if (gpa >= 3.5) return "A-"; else if (gpa >= 3.0) return "B"; else if (gpa >= 2.0) return "C"; else if (gpa >= 1.0) return "D"; else return "F"; };

const start = () => { if (!className || !subjectCount) return alert("Fill all fields"); setCurrentMarks(Array(Number(subjectCount)).fill("")); setStarted(true); };

const updateMark = (i, val) => { const copy = [...currentMarks]; copy[i] = val; setCurrentMarks(copy); };

const submitStudent = () => { if (!name || !roll) return alert("Enter name and roll");

let fail = false;
let total = 0;
let gpSum = 0;

const marksNum = currentMarks.map((m) => Number(m));

marksNum.forEach((m) => {
  if (m < 33) fail = true;
  total += m;
  gpSum += getGP(m);
});

const gpa = fail ? 0 : gpSum / marksNum.length;

const student = {
  id: Date.now(),
  name,
  roll: Number(roll),
  marks: marksNum,
  total,
  gpa: Number(gpa.toFixed(2)),
  grade: getGrade(gpa),
  status: fail ? "FAIL" : "PASS",
};

const updated = [...students, student];
setStudents(updated);
setViewIndex(updated.length - 1);

setName("");
setRoll("");
setCurrentMarks(Array(Number(subjectCount)).fill(""));

};

const getMeritList = () => { return [...students] .sort((a, b) => { if (b.gpa !== a.gpa) return b.gpa - a.gpa; if (b.total !== a.total) return b.total - a.total; return a.roll - b.roll; // lower roll better }) .map((s, i) => ({ ...s, position: i + 1 })); };

const stats = () => { if (students.length === 0) return null;

const pass = students.filter((s) => s.status === "PASS").length;
const fail = students.length - pass;
const passRate = ((pass / students.length) * 100).toFixed(2);

const count = (g) => students.filter((s) => s.grade === g).length;

return {
  pass,
  fail,
  passRate,
  aPlus: count("A+"),
  a: count("A"),
  aMinus: count("A-"),
  b: count("B"),
  c: count("C"),
  d: count("D"),
  f: count("F"),
};

};

const data = stats(); const current = students[viewIndex]; const merit = getMeritList();

return ( <div style={{ padding: 20, color: "white", background: "linear-gradient(135deg,#0f172a,#1e293b)", minHeight: "100vh", fontFamily: "sans-serif" }}>

{!started ? (
    <div>
      <h1>GPA Manager Pro</h1>

      <input placeholder="Class Name" value={className}
        onChange={(e) => setClassName(e.target.value)} />
      <br /><br />

      <input type="number" placeholder="Subjects"
        value={subjectCount}
        onChange={(e) => setSubjectCount(e.target.value)} />
      <br /><br />

      <button onClick={start}>Start</button>
    </div>
  ) : (
    <div>

      <div style={{ padding: 10, background: "#111827", borderRadius: 10 }}>
        <h3>Enter Student</h3>

        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Roll" value={roll} onChange={(e) => setRoll(e.target.value)} />

        {currentMarks.map((m, i) => (
          <input key={i}
            type="number"
            placeholder={`Sub ${i + 1}`}
            value={m}
            onChange={(e) => updateMark(i, e.target.value)}
          />
        ))}

        <button onClick={submitStudent}>Add Student</button>
      </div>

      <div style={{ marginTop: 15, padding: 10, background: "#0b1220", borderRadius: 10 }}>
        <h3>Select Student</h3>
        <select onChange={(e) => setViewIndex(Number(e.target.value))}>
          {students.map((s, i) => (
            <option key={s.id} value={i}>
              Roll {s.roll} - {s.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 20, padding: 15, background: "#0b1220", borderRadius: 10 }}>
        <h2>Individual Result</h2>
        {current && (
          <div>
            <h3>{current.name} (Roll {current.roll})</h3>
            <p>Total: {current.total}</p>
            <p>GPA: {current.gpa}</p>
            <p>Grade: {current.grade}</p>
            <p>Status: {current.status}</p>
          </div>
        )}
      </div>

      {data && (
        <div style={{ marginTop: 20, padding: 15, background: "#111827", borderRadius: 10 }}>
          <h2>Summary</h2>
          <p>Pass: {data.pass}</p>
          <p>Fail: {data.fail}</p>
          <p>Pass Rate: {data.passRate}%</p>
          <p>A+: {data.aPlus} | A: {data.a} | A-: {data.aMinus}</p>
          <p>B: {data.b} | C: {data.c} | D: {data.d} | F: {data.f}</p>
        </div>
      )}

      <div style={{ marginTop: 20, padding: 15, background: "#0b1220", borderRadius: 10 }}>
        <h2>🏆 Merit List</h2>

        <table style={{ width: "100%", color: "white" }}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Roll</th>
              <th>GPA</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {merit.map((s) => (
              <tr key={s.id}>
                <td>{s.position}</td>
                <td>{s.name}</td>
                <td>{s.roll}</td>
                <td>{s.gpa}</td>
                <td>{s.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )}

</div>

); }
