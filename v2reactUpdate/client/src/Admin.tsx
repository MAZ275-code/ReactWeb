import { useState, useEffect } from "react";

export function AdminPage({ apiCall, user }) {
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
