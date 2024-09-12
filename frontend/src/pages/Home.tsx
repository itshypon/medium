import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-8 justify-center items-center bg-black h-screen font-mono">
      <div className="text-white text-3xl font-bold">Medium</div>
      <div className="flex justify-between gap-4">
        <button
          className="bg-white border rounded px-2 py-2"
          onClick={() => navigate("signup")}
        >
          Sign Up
        </button>
        <button
          className="bg-white border rounded px-2 py-2"
          onClick={() => navigate("signin")}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
