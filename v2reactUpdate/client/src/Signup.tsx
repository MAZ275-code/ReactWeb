const Signup = ({ setOnSignup, handleSignupSubmit, signupError }) => {
  return (
    <div
      id="signup-container"
      className="flex flex-1 items-center justify-center"
    >
      <div className="w-full max-w-md bg-white rounded-xl p-4 border border-gray-300">
        <div className="space-y-2">
          <p className="text-2xl font-bold text-center">Signup</p>
          <p className="text-center">
            Already have an account?{" "}
            <button
              onClick={() => setOnSignup(false)}
              className="text-zinc-500 font-semibold"
            >
              Login
            </button>
          </p>
        </div>
        <form onSubmit={handleSignupSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="block font-semibold" htmlFor="name">
              Name
            </label>
            <input
              className="block px-2 py-1.5 w-full border border-gray-200 rounded"
              placeholder="Enter your name"
              name="name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold" htmlFor="username">
              Username
            </label>
            <input
              className="block px-2 py-1.5 w-full border border-gray-200 rounded"
              placeholder="Enter your username"
              required
              name="username"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold" htmlFor="password">
              Password
            </label>
            <input
              className="block px-2 py-1.5 w-full border border-gray-200 rounded"
              type="password"
              placeholder="Enter your password"
              name="password"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold" htmlFor="role">
              Role
            </label>
            <select
              className="block px-2 py-1.5 w-full border border-gray-200 rounded"
              name="role"
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <p className="text-red-500 text-sm tracking-wider font-semibold">
            {signupError}
          </p>
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-800 text-white py-2"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
