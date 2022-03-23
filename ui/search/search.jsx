import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import "./styles.css";

const SearchBar = ({ onChange, children }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const searchField = useRef();
  let keysPressed = {};

  document.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;

    if (keysPressed["Control"] && event.key == "q") {
      if (searchField.current) {
        setIsFocused(true);
        searchField.current.focus();
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    delete keysPressed[event.key];
  });

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }
    const identifier = setTimeout(() => {
      onChange(text);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [text]);

  return (
    <div className={isFocused ? " search-bar focused" : "search-bar"}>
      <FiSearch color="var(--grey-text)" size={20} style={{ flex: 1 }} />
      <input
        placeholder="Search & Filter"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={searchField}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="shortcut">
        <div className="key">ctrl</div>
        <span>+</span>
        <div className="key">Q</div>
      </div>
      {/* <div
        className='filter-container'
        style={{ maxHeight: isFocused && !searchField.current.value ? 500 : 0 }}
      >
        <p>Quick Filter</p>
        <div>{children}</div>
      </div> */}
    </div>
  );
};

export default SearchBar;
