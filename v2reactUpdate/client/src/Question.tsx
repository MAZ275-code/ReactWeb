import { useState } from "react";

export function Question({ q, apiCall }) {
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
