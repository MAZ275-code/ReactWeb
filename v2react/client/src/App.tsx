import { useEffect, useState } from "react";

const App = () => {
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
      )}
      {!user && !onSignup && (
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

function AdminPage({ apiCall, user }) {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [teacherRes, courseRes] = await Promise.all([
        apiCall("/v1/teachers"),
        apiCall("/v1/courses"),
      ]);
      setTeachers(teacherRes);
      setCourses(courseRes);
    };

    fetchData();
  }, []);

  const onAssign = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await apiCall(
      `/v1/teachers/${selectedTeacherId}/assign-course`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId: selectedCourseId }),
      }
    );

    if (res.id) {
      setMessage("Course assigned successfully.");
      setSelectedTeacherId("");
      setSelectedCourseId("");
    } else {
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="m-4 space-y-2">
      <h1 className="text-3xl font-bold">Admin</h1>
      <h2 className="text-xl font-semibold pb-2">Welcome {user.name}</h2>
      <div>
        <h3 className="text-lg font-semibold">Teachers</h3>
        <table className="w-full text-sm text-left text-gray-800">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="bg-white border-b">
                <td className="px-6 py-4">{teacher.id}</td>
                <td className="px-6 py-4">{teacher.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Courses</h3>
        <table className="w-full text-sm text-left text-gray-800">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Course Name</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="bg-white border-b">
                <td className="px-6 py-4">{course.id}</td>
                <td className="px-6 py-4">{course.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded-xl p-4 space-y-2">
        <h3 className="text-lg font-semibold">Assign a course</h3>
        <form onSubmit={onAssign} className="space-y-4">
          <div>
            <label className="font-semibold mr-2">Pick teacher</label>
            <select
              required
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="block w-full rounded"
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold mr-2">Pick course</label>
            <select
              required
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="block w-full rounded"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <button className="rounded-lg bg-zinc-800 text-white py-1.5 px-3">
            Assign Course
          </button>
          {message && <p className="text-green-500">{message}</p>}
        </form>
      </div>
    </div>
  );
}

function TeacherPage({ apiCall, user }) {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await apiCall(`/v1/teachers/${user.id}/courses`);
      setAssignedCourses(res);
    };
    const fetchAnswers = async () => {
      const answers = await apiCall(`/v1/teachers/${user.id}/answers`);
      setAnswers(answers);
    };
    fetchAssignments();
    fetchAnswers();
  }, []);

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await apiCall(
      `/v1/teachers/${user.id}/courses/${selectedCourseId}/question`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: questionText }),
      }
    );

    if (res.id) {
      setMessage("Question posted successfully.");
      setQuestionText("");
      setSelectedCourseId("");
    } else {
      setMessage("An error occurred.");
    }
  };

  async function handleToggleAnswerCorrect(ansId: string) {
    setAnswers((prev) =>
      prev.map((ans) =>
        ans.id === ansId ? { ...ans, is_correct: !ans.is_correct } : ans
      )
    );

    const res = await apiCall(
      `/v1/teachers/${user.id}/answers/${ansId}/toggle`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.message) {
      alert(res.message);
    } else if (res.id) {
      alert("An error occured.");
    }
  }

  return (
    <div className="m-4 space-y-2">
      <h1 className="text-3xl font-bold">Teacher</h1>
      <h2 className="text-xl font-semibold pb-2">Welcome {user.name}</h2>
      <div>
        <h3 className="text-lg font-semibold">Assigned Courses</h3>
        <table className="w-full text-sm text-left text-gray-800">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
            </tr>
          </thead>
          <tbody>
            {assignedCourses.length > 0 ? (
              assignedCourses.map((course) => (
                <tr key={course.id} className="bg-white border-b">
                  <td className="px-6 py-4">{course.id}</td>
                  <td className="px-6 py-4">{course.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">
                  No assigned courses
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded-xl p-4 space-y-2">
        <h3 className="text-lg font-semibold">Post a question</h3>
        <form onSubmit={handlePostQuestion} className="space-y-4">
          <div>
            <label className="font-semibold mr-2">Pick course</label>
            <select
              required
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="block w-full rounded"
            >
              <option value="">Select a course</option>
              {assignedCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold mr-2">Question</label>
            <input
              required
              className="block px-2 py-1.5 w-full border border-gray-200 rounded"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question"
            />
          </div>
          <button className="rounded-lg bg-zinc-800 text-white py-1.5 px-3">
            Post Question
          </button>
          {message && <p className="text-green-500">{message}</p>}
        </form>
      </div>
      <div className="bg-white rounded-xl p-4 space-y-2">
        <h3 className="text-lg font-semibold">Evaluate Answers</h3>
        <table className="w-full text-sm text-left text-gray-800">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th className="px-6 py-3">Question</th>
              <th className="px-6 py-3">Answer</th>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Is Correct?</th>
              <th className="px-6 py-3">Marked</th>
            </tr>
          </thead>
          <tbody>
            {answers?.map((answer) => (
              <tr className="bg-white border-b">
                <td className="px-6 py-4">{answer.question_text}</td>
                <td className="px-6 py-4">{answer.text}</td>
                <td className="px-6 py-4">{answer.student_name}</td>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={answer.is_correct}
                    onClick={() => handleToggleAnswerCorrect(answer.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  {answer.is_correct == null ? "No" : "Yes"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentPage({ user, apiCall }) {
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await apiCall("/v1/courses");
      setCourses(res);
    };

    fetchCourses();
  }, []);

  const handleViewQuestions = async (e) => {
    e.preventDefault();
    const courseId = e.target.courseId.value;
    setQuestions([]);
    const questions = await apiCall(`/v1/courses/${courseId}/questions`);
    setQuestions(questions);
  };

  return (
    <div className="m-4 space-y-2">
      <h1 className="text-3xl font-bold">Student</h1>
      <h2 className="text-xl font-semibold pb-2">Welcome {user.name}</h2>
      <div>
        <h3 className="text-lg font-semibold">View questions</h3>
        <form className="space-y-4 mt-4" onSubmit={handleViewQuestions}>
          <div>
            <label className="font-semibold mr-2">Pick course</label>
            <select required name="courseId" className="block w-full rounded">
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <button className="rounded-lg bg-zinc-800 text-white py-1.5 px-3">
            View questions
          </button>
        </form>
      </div>
      <div className="space-y-2">
        {questions?.map((q) => (
          <Question q={q} apiCall={apiCall} />
        ))}
      </div>
    </div>
  );
}

function Question({ q, apiCall }) {
  const [message, setMessage] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const answer = e.target.answer.value;
    const res = await apiCall(`/v1/questions/${q.id}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherId: q.teacher_id,
        answer,
      }),
    });

    if (res.message) {
      setMessage(message);
    } else {
      setMessage("Failed to submit answer.");
    }
  };

  return (
    <form
      className="space-y-4 mt-4 bg-white rounded-xl p-4"
      onSubmit={handleOnSubmit}
    >
      <p className="text-lg">
        <span className="font-semibold">Question:</span> {q.text}
      </p>
      <div className="space-y-2 flex items-center">
        <label className="font-semibold mr-2" htmlFor="answer">
          Answer
        </label>
        <input
          name="answer"
          required
          className="px-2 py-1.5 flex-1 border border-gray-200 rounded"
          disabled={q.answer_text != null}
          defaultValue={q.answer_text ?? undefined}
        />
      </div>
      {message && <p className="text-green-500">{message}</p>}

      {q.answer_text == null ? (
        <button
          type="submit"
          className="rounded-lg bg-zinc-800 text-white py-1.5 px-3"
        >
          Submit
        </button>
      ) : (
        ""
      )}
      {q.is_correct != null ? (
        q.is_correct ? (
          <p className="text-green-500 font-semibold">Marked as correct</p>
        ) : (
          <p className="text-red-500 font-semibold">Marked as incorrect</p>
        )
      ) : null}
    </form>
  );
}

export default App;
