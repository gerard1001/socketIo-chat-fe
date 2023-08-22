import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Button,
  OutlinedInput,
  InputAdornment,
  TextField,
} from "@mui/material";
import axios from "../axios/axios.instance";
import { useLoginData } from "../contexts/LoginContext";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { IoPause, IoSend } from "react-icons/io5";
import { FaPlus, FaPlusCircle } from "react-icons/fa";
import { useSockets } from "../contexts/SocketContext";
import { v4 as uuidv4 } from "uuid";

const convertTime = (time) => {
  const hrs = time.getHours();
  const mins = time.getMinutes();
  const date = time.toLocaleDateString();

  return `${hrs}:${mins}`;
};

const Chat = () => {
  const nav = useNavigate();
  const { socket } = useSockets();
  const { loginData, setLoginData } = useLoginData();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userMessages, setUserMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [arr, setArr] = useState([]);
  const [message, setMessage] = useState("");
  const [picture, setPicture] = useState({
    file: [],
    preview: [],
  });
  const [validSession, setValidSession] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    axios.get(`/user/${loginData?.user?._id}`).then((res) => {
      setUsers(res.data);
    });

    axios
      .post(`/message/get`, {
        to: arr,
      })
      .then((res) => {
        setUserMessages(res.data.data);
      });
  }, [loginData, selectedUser]);

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem("holaChatUser"));

    axios
      .get(`/user/verify/${localStorageData?.token}`)
      .then((res) => {
        setValidSession(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    setLoginData(localStorageData);
    if (!loginData) {
      nav("/login", { replace: true });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setLoginData(null);
    nav("/login", { replace: true });
  };

  const handleUploadImages = (e) => {
    setPicture({
      file: [...e.target.files],
      preview: [...e.target.files]?.map((prev) => URL.createObjectURL(prev)),
    });
  };

  const handleSendMessage = async () => {
    if (selectedUser && (message !== "" || picture)) {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("to", selectedUser?._id);
      picture?.file?.forEach((image) => {
        formData.append("picture", image);
      });
      await axios
        .post(`/message`, formData)
        .then((res) => {
          socket.emit("send_message", {
            from: loginData?.user?._id,
            to: selectedUser?._id,
            toName: selectedUser?.firstName,
            message: message,
            picture: res.data.data.picture,
          });

          let msgs = [...userMessages];
          msgs.push({
            sender: loginData?.user?._id,
            message: {
              text: message,
            },
            picture: res.data.data.picture,
          });
          setUserMessages(msgs);
        })
        .then(() => {
          setMessage("");
          setPicture(null);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setNewMessage({
        sender: data.from,
        message: {
          text: data.message,
        },
        picture: data.picture,
      });
    });
  }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages]);

  useEffect(() => {
    newMessage && setUserMessages((prev) => [...prev, newMessage]);
  }, [newMessage]);

  useEffect(() => {
    socket.emit("add_user", {
      userId: loginData?.user?._id,
      name: loginData?.user?.lastName,
    });
  }, [users]);
  return (
    <Box className="min-h-[100vh] flex items-center justify-center">
      <Box className="w-[90%] max-w-[1200px] h-[90vh] min-h-[440px] bg-[#0000003d] rounded-[10px] p-4 flex items-center gap-2">
        <Box className="w-1/4 h-full bg-[#0f0733] rounded-xl overflow-auto flex flex-col items-center gap-1 pb-10 pt-1 px-2">
          <Box className="h-fit w-full py-2">
            <Box
              className="p-2 px-0 flex items-center w-full gap-4 rounded-lg truncate"
              onClick={() => {
                setSelectedUser(null);
              }}
            >
              <img
                src={loginData?.user?.picture}
                alt=""
                className="w-[80px] aspect-square object-cover cursor-pointer"
              />
              <Typography className="text-white font-semibold">
                {loginData?.user?.firstName} {loginData?.user?.lastName} (You)
              </Typography>
              <Button className="bg-slate-50 w-[40px]" onClick={handleLogout}>
                <MdLogout className="text-[25px] text-fuchsia-700 font-bold" />
              </Button>
            </Box>
          </Box>
          <Box className="w-full  bg-[#a0a0a034] overflow-auto flex flex-col items-center gap-1 py-1 px-2 border-4 border-[#00000009]">
            {users?.data?.map((user, idx) => {
              return (
                <Box
                  key={user._id}
                  className={`cursor-pointer p-2 flex items-center w-full gap-4 rounded-lg truncate min-h-[64px] text-white ${
                    selectedUser?._id === user._id
                      ? "bg-[#02020e]"
                      : "bg-[#061330]"
                  } hover:bg-[#0c214e]`}
                  onClick={() => {
                    setSelectedUser(user);
                    setArr(Array(user._id));
                  }}
                >
                  <img
                    src={user.picture}
                    alt=""
                    className="w-[55px] aspect-square object-cover rounded-[50%]"
                  />
                  <Typography>
                    {user.firstName} {user.lastName}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box className="w-3/4 flex flex-col h-full bg-[#000000] p-1 rounded-lg">
          <Box className="h-[10%] bg-[#000000]">
            {selectedUser && (
              <Box className="h-fit w-full pl-5">
                <Box className="p-2 px-0 flex items-center w-full gap-4 rounded-lg truncate">
                  <img
                    src={selectedUser?.picture}
                    alt=""
                    className="w-[50px] aspect-square rounded-[50%] object-cover cursor-pointer"
                  />
                  <Typography className="text-white font-semibold">
                    {selectedUser?.firstName} {selectedUser?.lastName}{" "}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          <Box className="h-[90%] bg-orange-300 chat-paper rounded-b-lg overflow-auto flex flex-col gap-1 py-5 pb-0 relative">
            {picture?.preview[0] && (
              <Box className="fixed left-3 bottom-6 flex flex-col gap-2 bg-white p-4 pt-10 max-h-[70%] overflow-auto">
                <IconButton className="absolute top-1 right-1">
                  <IoPause
                    onClick={() => {
                      setPicture({
                        file: [],
                        preview: [],
                      });
                    }}
                  />
                </IconButton>
                {picture?.preview?.map((prev, idx) => {
                  return (
                    <img
                      key={idx}
                      src={prev}
                      alt=""
                      className="w-[100px] aspect-video rounded object-cover"
                    />
                  );
                })}
              </Box>
            )}
            {selectedUser ? (
              <Box className="relative">
                {userMessages?.map((message) => {
                  return (
                    <Box
                      ref={scrollRef}
                      key={uuidv4()}
                      className={`${
                        loginData?.user?._id !== message.sender
                          ? "flex  items-center justify-start"
                          : "flex items-center justify-end"
                      } w-full px-2`}
                    >
                      <Box className="w-fit max-w-[50%]">
                        <Box
                          className={`flex items-start gap-1 
                        ${
                          loginData?.user?._id === message.sender
                            ? "flex-row-reverse"
                            : "flex-row"
                        }
                        `}
                        >
                          <img
                            src={
                              loginData?.user?._id === message.sender
                                ? loginData?.user?.picture
                                : selectedUser?.picture
                            }
                            alt=""
                            className="w-[40px] aspect-square rounded-[50%] object-cover"
                          />
                          <Box>
                            <Box
                              className={`${
                                loginData?.user?._id === message.sender
                                  ? "bg-zinc-100 text-slate-900"
                                  : "bg-slate-900 text-white"
                              }  rounded-[10px] p-2 my-[2px] w-fit h-full `}
                            >
                              {message.picture[0] ? (
                                <>
                                  {" "}
                                  {message.picture.map((pic) => {
                                    return (
                                      <img
                                        src={pic}
                                        alt=""
                                        className="w-[full] h-auto rounded-lg my-1"
                                      />
                                    );
                                  })}
                                </>
                              ) : null}
                              {message.message.text}
                            </Box>
                            <Box className="text-white">
                              {convertTime(new Date(message.createdAt))}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Box className="w-full h-full flex items-center justify-center">
                <Box className="w-fit h-fit bg-[#0000006e] rounded-xl p-4">
                  <Typography className="text-3xl font-bold text-center">
                    Hello{" "}
                    <span className="text-rose-700 text-3xl font-bold">
                      {loginData?.user?.firstName}
                    </span>
                  </Typography>
                  <Typography className="text-center">
                    Please select a user to start chatting
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          <Box className="w-full h-fit bottom-0 rounded-1 border-[6px] border-[#000000]">
            <input
              multiple
              type="file"
              id="picture"
              name="picture"
              onChange={handleUploadImages}
              className="hidden"
            />
            <OutlinedInput
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              className="w-full bg-white"
              startAdornment={
                <InputAdornment>
                  <IconButton component="label" htmlFor="picture">
                    <FaPlusCircle />
                  </IconButton>
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment>
                  <IconButton onClick={handleSendMessage}>
                    <IoSend />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
