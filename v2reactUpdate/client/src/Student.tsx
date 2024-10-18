import { useState, useEffect } from "react";
import { Question } from "./Question";

export function StudentPage({ user, apiCall }) {
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
