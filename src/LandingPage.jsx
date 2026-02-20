import React from "react";

export default function LandingPage({
  exercises = [],
  onChangeReps = () => {},
  onStart = () => {},
  lang = "en",
  level = "beginner",
  onLevelChange = () => {}
}) {
  return (
    <div style={page}>
      <h1 style={title}>PranaFlow</h1>

      {/* SHLOKA */}
      <div style={shlokaBox}>
        <div style={shloka}>
          तस्मिन् सति श्वासप्रश्वासयोर्गतिविच्छेदः प्राणायामः ॥ २.४९ ॥
        </div>
        <div style={meaning}>
          {lang === "hi"
            ? "आसन की स्थिरता के पश्चात श्वास-प्रश्वास की गति का नियमन प्राणायाम कहलाता है।"
            : "After steadiness in posture, regulation of inhalation and exhalation is Prāṇāyāma."}
        </div>
      </div>

      <div style={panes}>
        {/* LEFT PANE — PRĀṆA */}
        <div style={pane}>
          <h3>PRĀṆA</h3>
          <p>
            {lang === "hi"
              ? "प्राण जीवन की मूल ऊर्जा है। यह केवल श्वास नहीं है, बल्कि वह शक्ति है जो हृदय की धड़कन, पाचन, विचार और भावनाओं को संचालित करती है।"
              : "Prāṇa is the fundamental energy of life. It is not merely breath, but the force that governs heartbeat, digestion, thoughts, and emotions."}
          </p>
          <p>
            {lang === "hi"
              ? "आज की तेज़ और तनावपूर्ण जीवनशैली में प्राण असंतुलित हो जाता है, जिसके परिणामस्वरूप थकान, चिंता और रोग उत्पन्न होते हैं।"
              : "In today’s fast and stressful lifestyle, prāṇa becomes disturbed, leading to fatigue, anxiety, and disease."}
          </p>
          <p>
            {lang === "hi"
              ? "प्राण को संतुलित करना जीवन में ऊर्जा, स्थिरता और मानसिक स्पष्टता लाता है।"
              : "Balancing prāṇa restores vitality, emotional stability, and mental clarity."}
          </p>
        </div>

        {/* CENTER PANE — EXERCISE SELECTION */}
        <div style={centerPane}>
          <h3>{lang === "hi" ? "अभ्यास चयन" : "Practice Selection"}</h3>

          <div style={exerciseGrid}>
            {exercises.map((ex, i) => (
              <div key={ex.id || i} style={exerciseRow}>
                <span>{ex?.label?.[lang] || ex?.label?.en || "—"}</span>
                <div>
                  <button onClick={() => onChangeReps(i, Math.max(0, (ex.reps ?? 0) - 1))}>
                    −
                  </button>
                  <span style={count}>{ex.reps ?? 0}</span>
                  <button onClick={() => onChangeReps(i, (ex.reps ?? 0) + 1)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* LEVEL SELECTION */}
          <div style={levelBox}>
            {[
              ["beginner", "6 / 12"],
              ["intermediate", "8 / 16"],
              ["advanced", "12 / 24"]
            ].map(([val, t]) => (
              <label key={val} style={levelLabel}>
                <input
                  type="radio"
                  checked={level === val}
                  onChange={() => onLevelChange(val)}
                />
                <span>
                  {lang === "hi"
                    ? val === "beginner"
                      ? "शुरुआती"
                      : val === "intermediate"
                      ? "मध्यम"
                      : "उन्नत"
                    : val.charAt(0).toUpperCase() + val.slice(1)}{" "}
                  ({t})
                </span>
              </label>
            ))}
          </div>

          {/* START */}
          <div style={startBox}>
            <button style={startBtn} onClick={onStart}>
              {lang === "hi" ? "सत्र प्रारंभ करें" : "Start Session"}
            </button>
          </div>
        </div>

        {/* RIGHT PANE — PRĀṆĀYĀMA */}
        <div style={pane}>
          <h3>PRĀṆĀYĀMA</h3>
          <p>
            {lang === "hi"
              ? "प्राणायाम श्वास के माध्यम से प्राण को नियंत्रित करने की विधि है। यह योग की वह कड़ी है जो शरीर को मन और मन को चेतना से जोड़ती है।"
              : "Prāṇāyāma is the method of regulating prāṇa through breath. It is the link between body, mind, and awareness."}
          </p>
          <p>
            {lang === "hi"
              ? "नियमित अभ्यास से तंत्रिका तंत्र शांत होता है, तनाव घटता है और ध्यान की क्षमता बढ़ती है।"
              : "Regular practice calms the nervous system, reduces stress, and enhances concentration."}
          </p>
          <p>
            {lang === "hi"
              ? "प्राणायाम किसी भी आयु में, किसी भी अवस्था में जीवन को संतुलित करने में सहायक है।"
              : "Prāṇāyāma supports balance and well-being at every age and stage of life."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES (UNCHANGED FROM YOUR ORIGINAL) ================= */

const page = { padding: 24, background: "#eaf4fb", minHeight: "100vh" };
const title = { textAlign: "center", marginBottom: 6 };
const shlokaBox = { textAlign: "center", marginBottom: 16 };
const shloka = { fontWeight: 500 };
const meaning = { fontSize: "0.9rem", opacity: 0.85 };
const panes = { display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: 24 };
const pane = { background: "#fff", padding: 16, borderRadius: 10 };
const centerPane = { background: "#fff", padding: 16, borderRadius: 10, border: "1px solid #ccc" };
const exerciseGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const exerciseRow = { display: "flex", justifyContent: "space-between", background: "#f7f7f7", padding: 6 };
const levelBox = { marginTop: 16, display: "flex", justifyContent: "space-around" };
const levelLabel = { whiteSpace: "nowrap" };
const count = { margin: "0 6px" };
const startBox = { display: "flex", justifyContent: "center", marginTop: 16 };
const startBtn = { padding: "8px 24px" };
