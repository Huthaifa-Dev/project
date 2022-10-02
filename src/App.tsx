import React, { useRef } from "react";

const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type here"
        onChange={(e) => console.log(e.target.value)}
      />
    </div>
  );
};

export default App;
