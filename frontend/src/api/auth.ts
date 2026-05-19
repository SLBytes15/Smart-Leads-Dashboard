import api from "./axios";
import type { AuthResponse } from "../types";

export const registerUser = async (
    name: string,
  email: string,
  password: string,
  role?: string
): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', {name,email,password,role});
    return res.data.data;
}

export const loginUser = async (
    email:string,
    password: string
): Promise<AuthResponse> => {
    const res = await api.post('/login', {email,password})
    return res.data.data;
}