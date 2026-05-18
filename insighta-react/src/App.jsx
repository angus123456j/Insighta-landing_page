import AmbientBackground from "./components/AmbientBackground.jsx";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <AmbientBackground />
      <div className="app">
        <Home />
      </div>
    </>
  );
}
