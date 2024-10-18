import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import { AdminPage } from "./Admin";
import { TeacherPage } from "./Teacher";
import { StudentPage } from "./Student";

export const App = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [onSignup, setOnSignup] = useState(false);

  const [signupError, setSignupError] = useState("");
  const [loginError, setLoginError] = useState("");

  const apiCall = async (
    url: string,
    options: RequestInit = { headers: {} }
  ) => {
    const response = await fetch(`http://localhost:3000/api${url}`, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.json();
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");

    const { name, username, password, role } = e.target;

    const signupRes = await apiCall("/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value,
        username: username.value,
        password: password.value,
        role: role.value,
      }),
    });

    if (!signupRes.success) {
      setSignupError(signupRes?.message ?? "An error occurred.");
      return;
    }

    onLogin(e);
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    const { username, password } = e.target;

    const res = await apiCall("/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (!res.success) {
      setLoginError(res.message);
      return;
    }

    setToken(res.token);
    setUser({ ...res.user, role: res.role });
  };

  const onLogout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col flex-1">
      {!user && onSignup && (
        <Signup
          setOnSignup={setOnSignup}
          handleSignupSubmit={handleSignupSubmit}
          signupError={signupError}
        />
      )}
      {!user && !onSignup && (
        <Login
          setOnSignup={setOnSignup}
          onLogin={onLogin}
          loginError={loginError}
        />
      )}
      {user && (
        <button
          type="button"
          className="absolute top-4 right-4 bg-zinc-800 text-white py-1.5 px-3 rounded-lg"
          onClick={onLogout}
        >
          Logout
        </button>
      )}
      {user && user.role === "admin" && (
        <AdminPage apiCall={apiCall} user={user} />
      )}
      {user && user.role === "teacher" && (
        <TeacherPage apiCall={apiCall} user={user} />
      )}
      {user && user.role === "student" && (
        <StudentPage apiCall={apiCall} user={user} />
      )}
    </div>
  );
};

export default App;
