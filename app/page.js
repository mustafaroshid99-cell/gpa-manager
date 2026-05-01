"use client";

import { useState } from "react";

export default function Home() {
  // NAVIGATION
  const [page, setPage] = useState("home");
  const [anim, setAnim] = useState(false);

  // PROJECT
  const [examName, setExamName] = useState("");
  const [subjectCount, setSubjectCount] = useState("");

  // STUDENTS
  const [students, setStudents] = useState([]);
  const [viewStudent, setViewStudent] = useState(null);

  // INPUT
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [marks, setMarks] = useState([]);

  const [searchRoll, setSearchRoll] = useState("");

  // ---------------- GPA LOGIC ----------------

  const gp = (m) => {
    if (m >= 80) return 5;
    if (m >= 70) return 4;
    if (m >= 60) return 3.5;
    if (m >= 50) return 3;
    if (m >= 40) return 2;
    if (m >= 33) return 1;
    return 0;
  };

  const grade = (g) => {
    if (g === 5) return "A+";
    if (g >= 4) return "A";
    if (g >= 3.5) return "A-";
    if (g >= 3) return "B";
    if (g >= 2) return "C";
    if (g >= 1) return "D";
    return "F";
  };

  // ---------------- NAV ----------------

  const navigate = (p) => {
    setAnim(true);
    setTimeout(() => {
      setPage(p);
      setAnim(false);
    }, 150);
  };

  // ---------------- START ----------------

  const start = () => {
    setMarks(Array(Number(subjectCount)).fill(""));
    navigate("app");
  };

  // ---------------- MARK UPDATE ----------------

  const updateMark = (i, v) => {
    const copy = [...marks];
    copy[i] = v;
    setMarks(copy);
  };

  // ---------------- ADD STUDENT ----------------

  const addStudent = () => {
    const nums = marks.map(Number);

    const total = nums.reduce((a, b) => a + b, 0);
    const fail = nums.some((m) => m < 33);

    const gpa = fail
      ? 0
      : nums.reduce((a, b) => a + gp(b), 0) / nums.length;

    const student = {
      name,
      roll,
      marks: nums,
      total,
      gpa: Number(gpa.toFixed(2)),
      grade: grade(gpa),
      status: fail ? "FAIL" : "PASS",
    };

    const idx = students.findIndex((s) => s.roll === roll);

    if (idx !== -1) {
      const ok = confirm("Student exists. Update?");
      if (!ok) return;

      const updated = [...students];
      updated[idx] = student;
      setStudents(updated);
      setViewStudent(student);
    } else {
      setStudents([...students, student]);
      setViewStudent(student);
    }

    setName("");
    setRoll("");
    setMarks(Array(Number(subjectCount)).fill(""));
  };

  // ---------------- SEARCH ----------------

  const search = () => {
    const s = students.find((x) => x.roll === searchRoll);
    setViewStudent(s || null);
  };

  // ---------------- MERIT ----------------

  const merit = [...students]
    .sort((a, b) => b.gpa - a.gpa || b.total - a.total || a.roll - b.roll)
    .map((s, i) => ({ ...s, rank: i + 1 }));

  // ---------------- SUMMARY ----------------

  const summary = () => {
    const pass = students.filter((s) => s.status === "PASS").length;
    const fail = students.length - pass;
    const rate = ((pass / students.length) * 100 || 0).toFixed(2);

    const count = (g) => students.filter((s) => s.grade === g).length;

    return { pass, fail, rate, count };
  };

  // ---------------- PDF EXPORT ----------------

  const exportPDF = () => window.print();

  // ---------------- UI ----------------

  return (
    <div style={styles.bg}>

      {/* NAV */}
      <div style={styles.nav}>
        <button onClick={() => navigate("home")} style={styles.btn}>🏠</button>
        <button onClick={() => navigate("app")} style={styles.btn}>📘</button>
        <button onClick={() => navigate("summary")} style={styles.btn}>📊</button>
        <button onClick={() => navigate("merit")} style={styles.btn}>🏆</button>
      </div>

      {/* ANIMATION WRAP */}
      <div style={{
        opacity: anim ? 0 : 1,
        transform: anim ? "scale(0.98)" : "scale(1)",
        transition: "0.2s"
      }}>

        {/* HOME */}
        {page === "home" && (
          <div style={styles.glass}>
            <h1>🎓 GPA Manager</h1>
            <input
              placeholder="Exam Name"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
            <input
              placeholder="Number of Subjects"
              value={subjectCount}
              onChange={(e) => setSubjectCount(e.target.value)}
            />
            <button style={styles.btn} onClick={start}>Start</button>
          </div>
        )}

        {/* APP */}
        {page === "app" && (
          <div style={styles.glass}>
            <h2>{examName}</h2>

            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Roll" value={roll} onChange={(e) => setRoll(e.target.value)} />

            {marks.map((m, i) => (
              <input
                key={i}
                type="number"
                value={m}
                placeholder={`Sub ${i + 1}`}
                onChange={(e) => updateMark(i, e.target.value)}
              />
            ))}

            <button style={styles.btn} onClick={addStudent}>Add Student</button>

            <input
              placeholder="Search roll"
              value={searchRoll}
              onChange={(e) => setSearchRoll(e.target.value)}
            />
            <button style={styles.btn} onClick={search}>Search</button>

            {viewStudent && (
              <div style={styles.card}>
                <h3>{viewStudent.name}</h3>
                <p>GPA: {viewStudent.gpa}</p>
                <p>Total: {viewStudent.total}</p>
                <p>Grade: {viewStudent.grade}</p>
                <p>Status: {viewStudent.status}</p>
              </div>
            )}
          </div>
        )}

        {/* SUMMARY */}
        {page === "summary" && (
          <div style={styles.glass}>
            <h2>📊 Summary</h2>
            <p>Pass: {summary().pass}</p>
            <p>Fail: {summary().fail}</p>
            <p>Rate: {summary().rate}%</p>

            <p>A+: {summary().count("A+")}</p>
            <p>A: {summary().count("A")}</p>
            <p>A-: {summary().count("A-")}</p>
            <p>B: {summary().count("B")}</p>
            <p>C: {summary().count("C")}</p>
            <p>D: {summary().count("D")}</p>
            <p>F: {summary().count("F")}</p>
          </div>
        )}

        {/* MERIT */}
        {page === "merit" && (
          <div style={styles.glass}>
            <h2>🏆 Merit List</h2>

            <button style={styles.btn} onClick={exportPDF}>
              Export PDF
            </button>

            <table style={styles.table}>
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
                  <tr key={s.roll}>
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
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#050816,#0f172a,#020617)",
    color: "white",
    padding: 20,
    fontFamily: "sans-serif",
  },
  nav: { display: "flex", gap: 10, marginBottom: 10 },
  glass: {
    padding: 18,
    borderRadius: 22,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(22px)",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  btn: {
    padding: "10px 14px",
    margin: 5,
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#22c55e)",
    color: "white",
    fontWeight: "bold",
  },
  card: {
    marginTop: 10,
    padding: 12,
    borderRadius: 16,
    background: "rgba(255,255,255,0.12)",
  },
  table: {
    width: "100%",
    marginTop: 10,
    textAlign: "center",
  },
};
