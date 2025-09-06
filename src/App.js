import React from "react";
import Hero from "./Hero";

export default function App() {
  return (
    <div>
      <Hero />
      <main style={{ padding: "40px", color: "white", backgroundColor: "#111" }}>
        <h2>Content Below</h2>
        <p>Scroll to see the background fade out.</p>
        <div style={{ height: "150vh" }}></div>
      </main>
    </div>
  );
}
