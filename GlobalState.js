import React, { createContext, useState } from "react";

// Create a new context

// Create a provider component
export const GlobalStateProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [userName, setUserName] = useState("");
  console.log("GlobalStateProvider: ", loggedIn, email, uid);
  return (
    <GlobalStateContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        email,
        setEmail,
        uid,
        setUid,
        userName,
        setUserName,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
export const GlobalStateContext = createContext();
