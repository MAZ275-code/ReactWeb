const Login = ({ setOnSignup, onLogin, loginError }) => {
  return (
    <div
      id="login-container"
      className="flex flex-1 items-center justify-center"
    >
      <div className="w-full max-w-md bg-white rounded-xl p-4 border border-gray-300">
        <div className="space-y-2">
          <p className="text-2xl font-bold text-center">Login</p>
          <p className="text-center">
            Don't have an account?{" "}
            <button
              onClick={() => setOnSignup(true)}
              className="text-zinc-500 font-semibold"
            >
              Signup
            </button>
          </p>
        </div>
        <form onSubmit={onLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="block font-semibold" htmlFor="username">
              Username
            </label>
            <input
              className="block px-2 py-1.5 w-full border border-gray-200 rounded"
              name="username"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold" htmlFor="password">
              Password
            </label>
            <input
              className="block px-2 py-1.5 w-full border border-gray-200 rounded"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <p className="text-red-500 text-sm tracking-wider font-semibold">
            {loginError}
          </p>
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-800 text-white py-2"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
