"use client";
import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { useRouter } from "next/navigation";

export default function HomeInput({
  name,
  password,
}: {
  name: string | undefined;
  password: string | undefined;
}) {
  const router = useRouter(); // <-- Initialize router
  const [newName, setNewName] = React.useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  function setCookie() {
    document.cookie = `name=${newName}; path=/; max-age=86400`;
    console.log(newName, newPassword);
    document.cookie = `password=${newPassword}; path=/; max-age=86400`;

    router.refresh();
  }
  function login() {
    console.log(password);
    if (oldPassword === password) {
      alert("Login successful!");
      router.push("/dashboard"); // <-- Redirect to dashboard
    } else {
      alert("Incorrect password. Please try again.");
    }
  }
  return (
    <div className="font-inter">
      {name ? (
        <div>
          <Input
            className="bg-white h-10"
            placeholder="Enter Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Button onClick={login} className="w-full mt-3 h-10 cursor-pointer">
            Login
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Input
            className="bg-white h-10"
            placeholder="Enter Username"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            className="bg-white h-10"
            placeholder="Enter Password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              console.log(newPassword);
            }}
          />
          <Button onClick={setCookie} className="w-full">
            Set Credentials
          </Button>
        </div>
      )}
    </div>
  );
}
