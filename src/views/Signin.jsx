import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import axios from "../axios/axios.instance";
import { toast } from "react-toastify";
import { toastOptions } from "../utils/toastOptions";
import { useLoginData } from "../contexts/LoginContext";

const Signin = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loginData, setLoginData } = useLoginData();

  const handleUserLogin = async () => {
    await axios
      .post(`/user/login`, { email, password })
      .then((res) => {
        toast.success(res?.data?.message, toastOptions);
        setLoginData(res?.data?.data);
        localStorage.setItem("holaChatUser", JSON.stringify(res?.data?.data));
      })
      .then(() => {
        setEmail("");
        setPassword("");
        nav("/chat");
      })
      .catch((error) => {
        toast.error(error.response.data.message, toastOptions);
      });
  };

  const toggleShowPassword = () => {
    setShowPassword((state) => !state);
  };

  useEffect(() => {
    if (loginData) {
      nav("/chat", { replace: true });
    }
  });

  return (
    <Box>
      <Box className="flex flex-col items-center justify-center w-[100vw] h-[100vh]">
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleUserLogin();
          }}
          className="flex flex-col items-center gap-4 bg-[#2e278a6c] p-5 rounded-[10px]"
        >
          <Box className="w-fit aspect-square p-8 rounded-[50%] bg-[#2e278a] mx-auto flex flex-col items-center justify-center">
            <FaUser className="text-white text-[30px]" />
          </Box>

          <TextField
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            name="email"
            placeholder="Email"
            className="bg-zinc-50 rounded min-w-[300px]"
          />
          <OutlinedInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="bg-zinc-50 rounded min-w-[300px]"
            endAdornment={
              <InputAdornment>
                <IconButton onClick={toggleShowPassword}>
                  {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            type="submit"
            className="bg-[#2e278a] text-white mx-auto h-[56px] min-w-[300px] py-3"
          >
            Sign in
          </Button>
          <Button
            sx={{
              border: "2px solid #fff",
            }}
            className="text-white border border-white  min-w-[300px] py-3"
            onClick={() => {
              nav("/register");
            }}
          >
            Sign up
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Signin;
