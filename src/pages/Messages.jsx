import React, { useEffect, useState } from "react";
import { useSockets } from "../contexts/SocketContext";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import { IoSend } from "react-icons/io5";

const msgs = [
  {
    name: "Abba",
    msg: "Hey",
    time: Date.now(),
    isMe: false,
  },
  {
    name: "Bob",
    msg: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est provident temporibus omnis eligendi itaque aperiam ea minima, ducimus nam similique dolorum adipisci aliquid cum pariatur harum repellat sed et officiis!",
    time: Date.now(),
    isMe: true,
  },
  {
    name: "CHAT_BOT",
    msg: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est provident temporibus omnis eligendi itaque aperiam ea minima, ducimus nam similique dolorum adipisci aliquid cum pariatur harum repellat sed et officiis!?",
    time: Date.now(),
    isMe: false,
  },
  {
    name: "CHAT_BOT",
    msg: "Hey There How are you?",
    time: Date.now(),
    isMe: true,
  },
  {
    name: "Bob",
    msg: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est provident temporibus omnis eligendi itaque aperiam ea minima, ducimus nam similique dolorum adipisci aliquid cum pariatur harum repellat sed et officiis!",
    time: Date.now(),
    isMe: true,
  },
  {
    name: "Abba",
    msg: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est provident temporibus omnis eligendi itaque aperiam ea minima, ducimus nam similique dolorum adipisci aliquid cum pariatur harum repellat sed et officiis!?",
    time: Date.now(),
    isMe: false,
  },
];

const Messages = () => {
  const [messagesReceived, setMessagesrecieved] = useState([]);
  const [message, setMessage] = useState("");
  const { socket, userName, setUserName, room, setRoom } = useSockets();

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessagesrecieved((state) => [
        ...state,
        {
          name: data.userName,
          msg: data.message,
          time: data.actionTime,
          isMe: data.userName !== userName ? false : true,
        },
      ]);
    });

    return () => socket.off("receive_message"); // like break
  }, [socket]);

  const sendMessage = () => {
    if (message !== "") {
      socket.emit("send_message", { message, userName, room });
      setMessage("");
    }
  };

  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hrs = date.getHours();
    const mins = date.getMinutes();
    const secs = date.getSeconds();
    return `${hrs}:${mins}:${secs}`;
  }
  return (
    <>
      {" "}
      <Box className="flex flex-col items-center gap-2">
        <Box className="bg-gray-600 max-w-[640px] mx-auto mt-10 w-full flex-col flex py-9 px-5 max-h-[450px] overflow-auto rounded-xl border-[10px] border-gray-600">
          {messagesReceived?.map((message, idx) => {
            return (
              <Box
                key={idx + 1}
                className={`${
                  !message.isMe
                    ? "flex  items-center justify-start"
                    : "flex items-center justify-end"
                } w-full p-2 ${
                  message.name === "CHAT_BOT" && "justify-center"
                }`}
              >
                {" "}
                <Box className="w-fit max-w-[90%]">
                  <Box
                    className={`${
                      !message.isMe && message.name !== "CHAT_BOT"
                        ? "bg-sky-600"
                        : "bg-emerald-600"
                    }  text-white rounded-[10px] p-2 w-fit h-full ${
                      message.name === "CHAT_BOT" && "bg-neutral-500"
                    }`}
                  >
                    {" "}
                    <Typography>{message.msg}</Typography>
                  </Box>
                  <Box
                    className={`flex items-center gap-1 w-full  ${
                      message.isMe && "justify-end"
                    }  ${
                      message.name === "CHAT_BOT" && "w-fit justify-center"
                    }`}
                  >
                    <Typography className="text-amber-100 text-[14px]">
                      {message.isMe && message.name !== "CHAT_BOT"
                        ? "You"
                        : `${message.name}`}
                    </Typography>{" "}
                    <Typography className="text-[12px] text-blue-400">
                      {formatDateFromTimestamp(message.time)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
        <Box className="w-fit h-hit relative bg-black">
          <Box>
            <TextField
              size="small"
              id="file"
              name="file"
              className="bg-slate-50 w-[100%] hidden"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <Box component="label" htmlFor="file"></Box>
            <TextField
              size="small"
              className="bg-slate-50 w-[100%]"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </Box>
          <Box
            className="absolute flex items-center justify-center -right-5 -top-[2%] w-[52px] h-[42px] rounded-[50%] bg-green-700 hover:bg-green-600"
            onClick={sendMessage}
          >
            {/* <IconButton> */}
            <IoSend className="text-white" />
            {/* </IconButton> */}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Messages;
