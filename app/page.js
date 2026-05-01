"use client"; import { useState } from "react";

export default function Home() { const [className, setClassName] = useState(""); const [subjectCount, setSubjectCount] = useState(""); const [started, setStarted] = useState(false);

const [name, setName] = useState(""); const [roll, setRoll] = useState("");

const [currentMarks, setCurrentMarks] = useState([]); const [students, setStudents] = useState([]);

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
  roll,
  marks: marksNum,
  total,
  gpa: Number(gpa.toFixed(2)),
  grade: getGrade(gpa),
  status: fail ? "FAIL" : "PASS",
};

setStudents([...students, student]);

setName("");
setRoll("");
setCurrentMarks(Array(Number(subjectCount)).fill(""));

};

const stats = () => { if (students.length === 0) return null;

const sorted = [...students].sort((a, b) => b.gpa - a.gpa);

const avg = students.reduce((a, b) => a + b.gpa, 0) / students.length;

const pass = students.filter((s) => s.status === "PASS").length;
const fail = students.length - pass;

const count = (g) => students.filter((s) => s.grade === g).length;

const passPercent = ((pass / students.length) * 100).toFixed(2);

return {
  sorted,
  avg: avg.toFixed(2),
  pass,
  fail,
  passPercent,
  aPlus: count("A+"),
  a: count("A"),
  aMinus: count("A-"),
  b: count("B"),
  c: count("C"),
  d: count("D"),
  f: count("F"),
};

};

const data = stats();

return ( <div style={{ padding: 20, color: "white", background: "#0f172a", minHeight: "100vh" }}> {!started ? ( <div> <h1>GPA Manager Pro</h1>

<input
        placeholder="Class Name"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Number of Subjects"
        value={subjectCount}
        onChange={(e) => setSubjectCount(e.target.value)}
      />

      <br /><br />

      <button onClick={start}>Start</button>
    </div>
  ) : (
    <div>
      <h2>{className}</h2>

      <h3>Student Info</h3>

      <input
        placeholder="Student Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Roll"
        value={roll}
        onChange={(e) => setRoll(e.target.value)}
      />

      <h3>Marks</h3>

      {currentMarks.map((m, i) => (
        <div key={i}>
          <input
            type="number"
            placeholder={`Subject ${i + 1}`}
            value={m}
            onChange={(e) => updateMark(i, e.target.value)}
          />
        </div>
      ))}

      <br />
      <button onClick={submitStudent}>Add Student</button>

      <hr />

      <h2>Individual Results</h2>

      {students.map((s, i) => (
        <div key={s.id} style={{ border: "1px solid gray", padding: 10, marginBottom: 10 }}>
          <h4>{s.name} (Roll: {s.roll})</h4>
          <p>Total Marks: {s.total}</p>
          <p>GPA: {s.gpa}</p>
          <p>Grade: {s.grade}</p>
          <p>Status: {s.status}</p>
        </div>
      ))}

      <hr />

      {data && (
        <div>
          <h2>Class Summary</h2>

          <p>Average GPA: {data.avg}</p>
          <p>Passed: {data.pass} | Failed: {data.fail}</p>
          <p>Pass Percentage: {data.passPercent}%</p>

          <h3>Grade Count</h3>
          <p>A+: {data.aPlus} | A: {data.a} | A-: {data.aMinus}</p>
          <p>B: {data.b} | C: {data.c} | D: {data.d} | F: {data.f}</p>

          <h3>Merit List</h3>
          {data.sorted.map((s, i) => (
            <div key={s.id}>
              #{i + 1} → {s.name} (Roll: {s.roll}) → GPA {s.gpa} ({s.grade})
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</div>

); }
