import { useState, useEffect } from "react";

export function TeacherPage({ apiCall, user }) {
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
