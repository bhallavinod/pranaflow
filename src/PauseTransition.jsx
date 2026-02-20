import React from "react";

export default function PauseTransition({ seconds }) {
  return (
    <div style={bg}>
      <div style={count}>{seconds}</div>
    </div>
  );
}

const bg = {
  height: "100vh",
  backgroundImage: "url(/universe.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const count = {
  fontSize: 48,
  color: "#fff"
};
