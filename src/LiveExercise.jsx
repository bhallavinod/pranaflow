import React, { useEffect, useRef, useState } from "react";
import { EXERCISE_INFO } from "./exerciseInfo";

const VIDEO_MAP = {
  nadi_shodhan: "/nadi_shodhan.mp4",
  surya_chandra_bhedi: "/surya_bhedi.mp4",
  ujjayi: "/ujjayi.mp4",
  bhramari: "/bhramari.mp4",
  sheetali: "/sheetali.mp4",
  sheetkari: "/sheetkari.mp4",
  kapalbhati: "/kapalbhati.mp4",
  antar_kumbhak: "/antar_kumbhak.mp4",
  bahya_kumbhak: "/bahya_kumbhak.mp4",
  agnisaar_kriya: "/agnisaar_kriya.mp4"
};

export default function LiveExercise({
  exercises = [],
  levelTiming,
  lang,
  onExit
}) {

  const [idx, setIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState("inhale");
  const [sec, setSec] = useState(levelTiming.inhale);
  const [mode, setMode] = useState("exercise");
  const [transitionSec, setTransitionSec] = useState(5);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [progress, setProgress] = useState(0);
  const [breathSound, setBreathSound] = useState(true);

  const bellRef = useRef(null);
  const inhaleRef = useRef(null);
  const exhaleRef = useRef(null);
  const audioCtxRef = useRef(null);
  const omOscRef = useRef(null);
  const phaseStartRef = useRef(null);
  const rafRef = useRef(null);

  const ex = exercises[idx];
  const info = ex ? EXERCISE_INFO[ex.id] : null;

  const isKapalbhati = ex?.id === "kapalbhati";
  const isReverse =
    ex?.id === "agnisaar_kriya" ||
    ex?.id === "bahya_kumbhak";

  /* ================= SESSION TIMER ================= */

  useEffect(() => {
    if (mode !== "exercise") return;
    const t = setInterval(() => {
      setSessionSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [mode]);

  /* ================= COUNTDOWN ================= */

  useEffect(() => {
    if (mode !== "exercise") return;
    const t = setInterval(() => {
      setSec(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [phase, mode]);

  /* ================= BREATH WAV SOUND ================= */

  useEffect(() => {
    if (!breathSound) return;

    if (phase === "inhale" && inhaleRef.current) {
      exhaleRef.current?.pause();
      inhaleRef.current.currentTime = 0;
      inhaleRef.current.volume = 0.6;
      inhaleRef.current.play().catch(()=>{});
    }

    if (phase === "exhale" && exhaleRef.current) {
      inhaleRef.current?.pause();
      exhaleRef.current.currentTime = 0;
      exhaleRef.current.volume = 0.6;
      exhaleRef.current.play().catch(()=>{});
    }

  }, [phase, breathSound]);

  /* ================= BELL ================= */

  const playBell = async () => {
    if (!bellRef.current) return;
    try {
      bellRef.current.currentTime = 0;
      await bellRef.current.play();
    } catch {}
  };

  /* ================= OM ================= */

  const startOM = () => {
    if (!audioCtxRef.current)
      audioCtxRef.current =
        new (window.AudioContext || window.webkitAudioContext)();

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 136.1;
    gain.gain.value = 0.25;

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    omOscRef.current = osc;
  };

  const stopOM = () => {
    if (omOscRef.current) {
      omOscRef.current.stop();
      omOscRef.current = null;
    }
  };

  /* ================= SMOOTH SCALE ================= */

  useEffect(() => {
    if (mode !== "exercise") return;

    phaseStartRef.current = performance.now();

    const duration =
      phase === "inhale"
        ? levelTiming.inhale
        : phase === "hold"
        ? levelTiming.hold
        : levelTiming.exhale;

    const animate = (now) => {
      const elapsed = now - phaseStartRef.current;
      const raw = Math.min(1, elapsed / (duration * 1000));
      const eased = 1 - Math.cos(raw * Math.PI / 2);
      setProgress(eased);
      if (raw < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);

  }, [phase, mode, levelTiming]);

  /* ================= PHASE ENGINE ================= */

  useEffect(() => {

    if (!ex || mode !== "exercise") return;
    let timeout;

    const goNext = () => {
      const nextRound = round + 1;
      const lastExercise = idx === exercises.length - 1;
      const lastRound = nextRound > ex.reps;

      if (lastRound) {
        if (lastExercise) setMode("summary");
        else setMode("transition");
        return;
      }

      setRound(nextRound);
      setPhase("inhale");
      setSec(levelTiming.inhale);
    };

    if (isKapalbhati) {

      if (phase === "inhale") {
        timeout = setTimeout(() => {
          setPhase("exhale");
          setSec(1);
        }, 2000);
      }
      else if (phase === "exhale") {
        timeout = setTimeout(goNext, 1000);
      }

      return () => clearTimeout(timeout);
    }

    if (!isReverse) {

      if (phase === "inhale") {
        timeout = setTimeout(() => {
          setPhase("hold");
          setSec(levelTiming.hold);
          playBell();
          startOM();
        }, levelTiming.inhale * 1000);
      }
      else if (phase === "hold") {
        timeout = setTimeout(() => {
          stopOM();
          playBell();
          setPhase("exhale");
          setSec(levelTiming.exhale);
        }, levelTiming.hold * 1000);
      }
      else if (phase === "exhale") {
        timeout = setTimeout(goNext, levelTiming.exhale * 1000);
      }

    } else {

      if (phase === "inhale") {
        timeout = setTimeout(() => {
          setPhase("exhale");
          setSec(levelTiming.exhale);
        }, levelTiming.inhale * 1000);
      }
      else if (phase === "exhale") {
        timeout = setTimeout(() => {
          setPhase("hold");
          setSec(levelTiming.hold);
          playBell();
          startOM();
        }, levelTiming.exhale * 1000);
      }
      else if (phase === "hold") {
        timeout = setTimeout(() => {
          stopOM();
          playBell();
          goNext();
        }, levelTiming.hold * 1000);
      }
    }

    return () => clearTimeout(timeout);

  }, [phase, round, idx, ex, exercises, levelTiming, mode, isKapalbhati, isReverse]);

  /* ================= TRANSITION ================= */

  useEffect(() => {
    if (mode !== "transition") return;

    const t = setInterval(() => {
      setTransitionSec(s => {
        if (s <= 1) {
          clearInterval(t);
          setIdx(i => i + 1);
          setRound(1);
          setPhase("inhale");
          setSec(levelTiming.inhale);
          setMode("exercise");
          return 5;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(t);

  }, [mode]);

  if (mode === "transition") {
    return (
      <div style={transitionWrapper}>
        <div style={starLayer}></div>
        <div style={glowLayer}></div>
        <div style={transitionCount}>{transitionSec}</div>
      </div>
    );
  }

  /* ================= SUMMARY ================= */

  if (mode === "summary") {

    const totalRounds = exercises.reduce((s,e)=>s+e.reps,0);
    const totalExercises = exercises.length;

    return (
      <div style={summaryWrapper}>
        <video src="/sage.mp4" autoPlay loop muted playsInline style={summaryVideo} />
        <div style={summaryOverlay}>
          <h2>Session Complete</h2>

          <div style={statsContainer}>
            <div style={statsColumn}>
              <div>Exercises: {totalExercises}</div>
              <div>Total Rounds: {totalRounds}</div>
              <div>Total Time: {sessionSeconds}s</div>
              <div>Breath Ratio: {levelTiming.inhale}:{levelTiming.hold}:{levelTiming.exhale}</div>
            </div>

            <div style={statsColumn}>
              <div>Avg Round Time: {(sessionSeconds/totalRounds).toFixed(1)}s</div>
              <div>Breath Symmetry: {(levelTiming.inhale/levelTiming.exhale).toFixed(2)}</div>
              <div>Hold Intensity Index: {((levelTiming.hold*totalRounds)/sessionSeconds).toFixed(2)}</div>
              <div>Session Score: {Math.max(50,100-(totalRounds*2))}%</div>
            </div>
          </div>

          <div style={bottomButton}>
            <button onClick={onExit}>End Session</button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= SCALE ================= */

  const fade = (r,g,b,p)=>{
    const nr=Math.round(r+(255-r)*p);
    const ng=Math.round(g+(255-g)*p);
    const nb=Math.round(b+(255-b)*p);
    return `rgb(${nr},${ng},${nb})`;
  };

  let scale, color;

  if (phase==="inhale"){
    scale=0.8+progress*0.5;
    color=fade(229,57,53,progress);
  } else if (phase==="exhale"){
    scale=1.3-progress*0.5;
    color=fade(67,160,71,progress);
  } else {
    scale=1.3-progress*0.3;
    color=fade(30,136,229,progress);
  }

  return (
    <div style={page}>

      <audio ref={bellRef} src="/bell.mp3" preload="auto" />
      <audio ref={inhaleRef} src="/inhale.wav" preload="auto" />
      <audio ref={exhaleRef} src="/exhale.wav" preload="auto" />

      <div style={videoPane}>
        <video src={VIDEO_MAP[ex.id]} autoPlay loop muted style={video} />
      </div>

      <div style={center}>
        <div style={circleWrapper}>
          <div
            style={{
              ...circle,
              transform:`scale(${scale})`,
              background:color,
              boxShadow:`0 0 60px ${color}`
            }}
          >
            <div style={circleText}>
              {phase.toUpperCase()}
              <br/>
              {sec}s
              {phase==="hold" && (
                <div style={mantraText}>
                  {lang==="hi"?"सोऽहम् — साक्षीभाव":"So'ham — Witness the stillness"}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={()=>setBreathSound(s=>!s)}
            style={toggleButton}
          >
            {breathSound?"Breath Sound: ON":"Breath Sound: OFF"}
          </button>
        </div>
      </div>

      <div style={pane}>
        <h3>Method</h3>
        <p>{info?.method[lang]}</p>
        <h3>Benefits</h3>
        <ul>{info?.benefits[lang].map((b,i)=><li key={i}>{b}</li>)}</ul>
        <h3>Do’s</h3>
        <ul>{info?.dos[lang].map((d,i)=><li key={i}>{d}</li>)}</ul>
        <h3>Don’ts</h3>
        <ul>{info?.donts[lang].map((d,i)=><li key={i}>{d}</li>)}</ul>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page={display:"grid",gridTemplateColumns:"1fr 1fr 1.4fr",height:"100vh",background:"#eef6ff"};
const center={display:"flex",alignItems:"center",justifyContent:"center"};
const circleWrapper={display:"flex",flexDirection:"column",alignItems:"center",gap:"40px"};
const videoPane={padding:16};
const video={width:"100%",height:"100%",objectFit:"contain"};
const pane={padding:20,overflowY:"auto"};
const circle={width:220,height:220,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.08s linear"};
const circleText={textAlign:"center",fontWeight:600};
const mantraText={marginTop:6,fontSize:"0.8rem",opacity:0.8};
const toggleButton={padding:"6px 16px",borderRadius:"20px",border:"none",background:"#1976d2",color:"white",cursor:"pointer",fontSize:"0.85rem",minWidth:"190px"};

const transitionWrapper={position:"relative",height:"100vh",width:"100vw",overflow:"hidden",background:"black",display:"flex",alignItems:"center",justifyContent:"center"};
const starLayer={position:"absolute",width:"170%",height:"170%",backgroundImage:"url('/universe.jpg')",backgroundSize:"cover",backgroundPosition:"center",animation:"starRotate 180s linear infinite",top:"-35%",left:"-35%",zIndex:1};
const glowLayer={position:"absolute",width:"100%",height:"100%",background:"radial-gradient(circle at center, rgba(255,255,255,0.25), transparent 70%)",animation:"glowPulse 6s ease-in-out infinite",zIndex:2};
const transitionCount={position:"relative",fontSize:"4rem",color:"#ffffff",fontWeight:600};

const summaryWrapper={position:"relative",height:"100vh",width:"100vw",overflow:"hidden"};
const summaryVideo={position:"absolute",width:"100%",height:"100%",objectFit:"cover"};
const summaryOverlay={position:"relative",zIndex:2,height:"100%",width:"100%",background:"rgba(0,0,0,0.5)",color:"white",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"20px"};
const statsContainer={display:"flex",gap:"60px"};
const statsColumn={display:"flex",flexDirection:"column",gap:"10px"};
const bottomButton={position:"absolute",bottom:"40px",left:"50%",transform:"translateX(-50%)"};
