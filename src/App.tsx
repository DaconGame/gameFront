import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { TitleScreen } from "./ui/TitleScreen.tsx";
import { PhaserGame } from "./game/PhaserGame.tsx";

function TitlePage() {
  const navigate = useNavigate();
  return <TitleScreen onStart={() => navigate("/game")} />;
}

function GamePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const exitToTitle = () => navigate("/");

    const onExit = () => exitToTitle();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitToTitle();
    };

    window.addEventListener("game:exit", onExit);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("game:exit", onExit);
      window.removeEventListener("keydown", onKey);
    };
  }, [navigate]);

  return <PhaserGame />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<TitlePage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
