import { Box, Button } from "@mui/material";
import React from "react";
import {} from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const nav = useNavigate();
  return (
    <Box className="text-white pt-10">
      <Box className="w-[280px] h-[280px] rounded-[50%] bg-[#2e278a] mx-auto flex flex-col items-center justify-center">
        <span className="uppercase text-[#eae8fd] text-[25px] font-bold">
          !Hola
        </span>
        <IoChatbox className="text-[100px]" />
        <span className="uppercase text-[#eae8fd] text-[25px] font-bold">
          chat!
        </span>
      </Box>
      <Box className="w-[320px] min-h-[100px] mt-10 bg-[#2e278a6c] mx-auto rounded-[10px] p-4">
        Welcome to{" "}
        <span className="text-[#51c8ff] uppercase font-bold">!Hola chat!</span>,
        a texting app where you can start a chat with a single individual or
        create a channel... Enjoy!
      </Box>
      <Box className="flex flex-col items-center pt-10 gap-5">
        <Button
          className="bg-[#2e278a] text-white min-w-[320px] mx-auto rounded-[20px]"
          onClick={() => {
            nav("/login");
          }}
        >
          Sign In
        </Button>
        <Button
          className="text-[#2e278a] font-bold min-w-[320px] mx-auto rounded-[20px]"
          onClick={() => {
            nav("/register");
          }}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default Landing;
