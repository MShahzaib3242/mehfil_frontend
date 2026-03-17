import React from "react";
import api from "../api";

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (data: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const checkUsername = async (username: string) => {
  const res = await api.get(`/auth/check-username/${username}`);
  return res.data;
};
