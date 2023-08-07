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

const Signup = () => {
  const nav = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState(null);
  const [pictureUrl, setPictureUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (picture) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPictureUrl(e.target.result);
      };
      reader.readAsDataURL(picture);
    }
  }, [picture]);

  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("picture", picture);

  const handleAddUser = async () => {
    await axios
      .post(`/user/register`, formData)
      .then((res) => {
        toast.success(res.data.message, toastOptions);
      })
      .then(() => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPicture("");
        setPictureUrl("");
        nav("/login");
      })
      .catch((error) => {
        toast.error(error.response.data.message, toastOptions);
      });
  };
  const toggleShowPassword = () => {
    setShowPassword((state) => !state);
  };

  return (
    <Box>
      <Box className="flex flex-col items-center justify-center w-[100vw] h-[100vh]">
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddUser();
          }}
          className="flex flex-col items-center gap-4 bg-[#2e278a6c] p-5 rounded-[10px]"
        >
          {pictureUrl ? (
            <>
              <img
                src={pictureUrl}
                alt="picture"
                className="w-[94px] aspect-square rounded-[50%] object-cover"
              />
            </>
          ) : (
            <Box className="w-fit aspect-square p-8 rounded-[50%] bg-[#2e278a] mx-auto flex flex-col items-center justify-center">
              <FaUser className="text-white text-[30px]" />
            </Box>
          )}

          <Box className="flex items-center gap-3">
            {" "}
            <TextField
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              name="name"
              type="text"
              placeholder="First name"
              className="bg-zinc-50 rounded min-w-[300px]"
            />
            <TextField
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              name="name"
              type="text"
              placeholder="Last name"
              className="bg-zinc-50 rounded min-w-[300px]"
            />
          </Box>
          <Box className="flex items-center gap-3">
            {" "}
            <TextField
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              name="email"
              type="email"
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
          </Box>
          <Box className="flex items-center gap-3">
            {" "}
            <TextField
              type="file"
              name="picture"
              id="picture"
              onChange={(e) => {
                setPicture(e.target.files[0]);
              }}
              className="hidden"
            />
            <Button
              component="label"
              htmlFor="picture"
              className="bg-rose-600 text-white mx-auto h-[56px] min-w-[300px] py-3"
            >
              Upload
            </Button>
          </Box>

          <Button
            type="submit"
            className="bg-[#2e278a] text-white mx-auto h-[56px] min-w-[300px] py-3"
          >
            Sign up
          </Button>
          <Button
            className="text-white border border-white  min-w-[300px] py-3"
            sx={{
              border: "2px solid #fff",
            }}
            onClick={() => {
              nav("/login");
            }}
          >
            Sign in
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
