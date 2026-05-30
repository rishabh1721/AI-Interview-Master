import React from "react";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { user, handleLogout } = useAuth();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <h1>Welcome to the Home Page</h1>

        <p>
          Logged in as: <strong>{user?.username || user?.email}</strong>
        </p>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </main>
  );
};

export default Home;
