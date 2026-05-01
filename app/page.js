"use client";
import { useState } from "react";

export default function Home() {
  const [className, setClassName] = useState("");
  const [subjectCount, setSubjectCount] = useState("");
  const [started, setStarted] = useState(false);

  const [currentMarks, setCurrentMarks] = useState([]);
  const [students, setStudents] = useState([]);

  const getGP = (m) => {
    if (m >= 80) return 5.0;
    else if (m >= 70) return 4.0;
    else if (m >= 60) return 3.5;
    else if (m >= 50) return 3.0;
    else if (m >= 40) return 2.0;
    else if (m >= 33) return 1.0;
    else return 0.0;
  };

  const getGrade = (gpa) => {
    if (gpa === 5.0) return "A+";
    else if (gpa >= 4.0) return "A";
    else if (gpa >= 3.5) return "A-";
    else if (gpa >= 3.0) return "B";
    else if (gpa >= 2.0) return "C";
    else if (gpa >= 1.0) return "D";
    else return "F";
  };

  const start = () => {
    if (!className || !subjectCount) return alert("Fill all fields");
    setCurrentMarks(Array(Number(subjectCount)).fill(""));
    setStarted(true);
  };

  const updateMark = (i, val) => {
    const copy = [...currentMarks];
    copy[i] = val;
    setCurrentMarks(copy);
  };

  const submitStudent = () => {
    let fail = false;
    let sum = 0;
    let total = 0;

    for (let m of currentMarks) {
      const num = Number(m);
      if (num < 33) fail = true;
      total += num;
      sum += getGP(num);
    }

    const gpa = fail ? 0 : sum / currentMarks.length;

    const student = {
      marks: [...currentMarks],
      total,
      gpa: Number(gpa.toFixed(2)),
      grade: getGrade(gpa),
      status: fail ? "FAIL" : "PASS",
    };

    setStudents([...students, student]);
    setCurrentMarks(Array(Number(subjectCount)).fill(""));
  };

  const stats = () => {
    if (students.length === 0) return null;

    const sorted = [...students].sort((a, b) => b.gpa - a.gpa);
    const avg =
      students.reduce((a, b) => a + b.gpa, 0) / students.length;

    const pass = students.filter((s) => s.status === "PASS").length;
    const fail = students.length - pass;
    const aPlus = students.filter((s) => s.grade === "A+").length;

    return { sorted, avg: avg.toFixed(2), pass, fail, aPlus };
  };

  const data = stats();

  return (
    <div style={{ padding: 20, color: "white", background: "#0f172a", minHeight: "100vh" }}>
      {!started ? (
        <div>
          <h1>GPA Manager</h1>

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

          <h3>Total Students: {students.length}</h3>

          {data && (
            <div>
              <h3>Average GPA: {data.avg}</h3>
              <h3>Pass: {data.pass} | Fail: {data.fail}</h3>
              <h3>A+: {data.aPlus}</h3>

              <h3>Merit List:</h3>
              {data.sorted.map((s, i) => (
                <div key={i}>
                  #{i + 1} → GPA: {s.gpa} ({s.grade})
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
  }
