import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function generateCodeVerifier() {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join(
    ""
  );
}

function generateState() {
  return Math.random().toString(36).substring(2);
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const appId = "2168077475412958074";
const redirectUri = "http://localhost:5173";

function App() {
  const onClick = async () => {
    const codeVerifier = generateCodeVerifier();
    console.log("codeVerifier", codeVerifier);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    console.log("codeChallenge", codeChallenge);
    const state = generateState();
    console.log("state", state);
    const authUrl = `https://oauth.zaloapp.com/v4/permission?app_id=${appId}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&state=${state}`;
    window.location.href = authUrl;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={onClick}
        style={{
          backgroundColor: "#1a1a1a",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
          outline: "2px solid blue",
        }}
      >
        Click me
      </button>
    </div>
  );
}

export default App;
