import React from "react";

function Input({ addItem, text, setText }) {
  return (
    <div className="input">
      <input
        placeholder="Type a task here"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={addItem}>Add Task</button>
    </div>
  );
}

export default Input;
