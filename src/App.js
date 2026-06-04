import { useState, useEffect, useRef } from "react";
import "./styles.css";

export default function App() {
  const [screen, setscreen] = useState("home");
  const [timeleft, settimeleft] = useState(10);
  const [circles, setcircles] = useState([]);
  const canvasRef = useRef(null);
  const canvasWidth = Math.min(window.innerWidth * 0.9, 650);
  const canvasHeight = Math.min(window.innerHeight * 0.7, 800);
  const [guess, setguess] = useState("");
  const [sub, setsub] = useState(false);
  {
  }
  useEffect(() => {
    if (screen !== "game") return;
    const generated = [];
    let attempts = 0;
    const target = Math.floor(Math.random() * 601);
    while (generated.length < target && attempts < 10000) {
      attempts++;
      const r =
        Math.random() < 0.5 ? Math.random() * 30 + 15 : Math.random() * 20 + 4;
      const x = Math.random() * (canvasWidth - r * 2) + r;
      const y = Math.random() * (canvasHeight - r * 2) + r;
      const c = ["pink", "lightblue", "plum"][Math.floor(Math.random() * 3)];
      const overlaps = generated.some((circle) => {
        const dx = circle.x - x;
        const dy = circle.y - y;
        return Math.sqrt(dx * dx + dy * dy) < circle.r + r + 2;
      });
      if (!overlaps) {
        generated.push({ x, y, r, color: c });
      }
      setcircles(generated);
    }
  }, [screen]);
  useEffect(() => {
    if (screen !== "game") return;
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    circles.forEach((circle) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.fill();
    });
  }, [circles]);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (circles.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    circles.forEach((circle) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.fill();
    });
  }, [circles]);
  useEffect(() => {
    if (screen !== "game") return;
    if (timeleft <= 0) {
      setscreen("guess");
      return;
    }
    const timer = setInterval(() => {
      settimeleft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, timeleft]);

  if (screen === "home") {
    return (
      <div
        style={{
          background: "#87CEEB",
          minHeight: "100vh",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h1>estimadle</h1>
        <button onClick={() => setscreen("instructions")}>Play Daily</button>
      </div>
    );
  }
  if (screen === "instructions") {
    return (
      <div
        style={{
          background: "#87CEEB",
          minHeight: "100vh",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <p>Count the Circles</p>
        <p>But you have only 10 seconds</p>
        <button onClick={() => setscreen("ready")}>Next</button>
      </div>
    );
  }
  if (screen === "ready") {
    return (
      <div
        style={{
          background: "#87CEEB",
          minHeight: "100vh",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <button
          onClick={() => {
            console.log("clicked");
            setscreen("game");
          }}
        >
          Start
        </button>
      </div>
    );
  }
  if (screen === "game") {
    return (
      <div
        style={{
          background: "#87CEEB",
          minHeight: "100vh",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: "10px solid goldenrod" }}
        />
        <div
          style={{
            display: "flex",
            Width: canvasWidth,
            marginTop: 5,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: timeleft * (canvasWidth / 10),
              height: 20,
              background: "green",
              transition: "width 1s linear",
            }}
          />
        </div>
      </div>
    );
  }
  if (screen === "guess") {
    return (
      <div
        style={{
          background: "#87CEEB",
          minHeight: "100vh",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>Enter your guess?</h2>
        <input
          type="text"
          value={guess}
          onChange={(e) => {
            const val = e.target.value;
            const valid = val === "" || !isNaN(val);
            if (valid) {
              setguess(val);
            }
          }}
          style={{ fontSize: "30px", width: "150px", textAlign: "center" }}
        />
        <br />
        <br />
        <button onClick={() => setscreen("results")}>submit</button>
      </div>
    );
  }
  if (screen === "results") {
    const actual = circles.length;
    const userGuess = parseInt(guess);
    const diff = Math.abs(actual - userGuess);
    const accuracy = (((actual - diff) / actual) * 100).toFixed(1);
    return (
      <div
        style={{
          background: "#87CEEB",
          minHeight: "100vh",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>results</h2>
        <p>
          you guessed <b style={{ color: "red" }}>{userGuess}</b> circles and
          there were
          <b style={{ color: "red" }}>{actual} </b>circles making you
          <b style={{ color: "red" }}>{diff}</b> away. you could have been at
          most <b style={{ color: "red" }}>{actual}</b> circles away so you were{" "}
          <b style={{ color: "red" }}>{accuracy}</b>%accurate.
        </p>
        <button
          onClick={() => {
            setscreen("home");
            settimeleft(10);
            setguess("");
            setcircles([]);
          }}
        >
          Play Again
        </button>
      </div>
    );
  }
}
