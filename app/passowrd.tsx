"use client";
import "./password.css";
import { useState, ChangeEvent, useEffect } from "react";
import { generatePassword } from "@/utils/index";
import { ToastContainer, toast } from "react-toastify";

export const Passowrd = () => {
  const [passwordLength, setPasswordLength] = useState(10);
  const [password, setPassword] = useState(generatePassword(passwordLength));
  const [isCopied, setIsCopied] = useState(false);

  const handleGeneratePassword = () => {
    setPassword(generatePassword(passwordLength));
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setIsCopied(true);

    toast("🦄 Copied to clipboard!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    setTimeout(() => {
      setIsCopied(false);
      setPassword(generatePassword(passwordLength));
    }, 2000);
  };
  const updatePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordLength(Number(e.target.value));
    handleGeneratePassword();
  };

  useEffect(() => {
    setPassword(generatePassword(passwordLength));
  }, [passwordLength]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 z-10 absolute w-full md:w-auto card">
      <ToastContainer />

      <h1 className="text-2xl font-bold ">Password Generator</h1>

      <div className="flex flex-wrap items-center space-x-2 justify-center">
        <label htmlFor="passwordLength" className="text-lg">
          Password Length: {passwordLength}
        </label>
        <input
          id="passwordLength"
          type="range"
          min="4"
          max="32"
          value={passwordLength}
          onChange={updatePassword}
          className="w-full md:w-64"
        />
      </div>

      <div className="flex flex-wrap items-center space-x-2 justify-center">
        <span className="text-lg">Password:</span>
        <input
          className="border border-gray-700 bg-gray-800 text-white rounded px-2 py-1 w-full md:w-auto"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center space-x-2 justify-center">
        <button
          onClick={handleGeneratePassword}
          className="px-4 py-2 text-white rounded transition-colors btn w-full md:w-auto"
        >
          Generate Password
        </button>

        <button
          onClick={handleCopyToClipboard}
          className="px-4 py-2 text-white rounded  transition-colors btn w-full md:w-auto mt-4 md:mt-0"
        >
          <span>{isCopied ? "Copied!" : "Copy Password"}</span>
        </button>
      </div>
    </div>
  );
};
