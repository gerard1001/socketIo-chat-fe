import React, { useContext } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useSockets } from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const nav = useNavigate();
  const { socket, userName, setUserName, room, setRoom } = useSockets();

  const joinRoom = () => {
    if (room !== "" && userName !== "") {
      socket.emit("join_room", { userName, room });
    }

    nav("/chat", { replace: true });
  };

  return (
    <Box className="pt-10">
      <Box className="px-6 py-10 mx-auto bg-slate-400 rounded-lg flex flex-col items-center gap-5 w-fit">
        <TextField
          className="min-w-[320px] bg-white text-white rounded"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
        <FormControl
          variant="outlined"
          className="bg-white border-none rounded"
          defaultValue=""
        >
          <InputLabel>__Choose room__</InputLabel>
          <Select
            className="min-w-[320px]"
            value={room}
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          >
            <MenuItem value="22000">neo4j</MenuItem>
            <MenuItem value="22001">posgresql</MenuItem>
            <MenuItem value="22010">mongodb</MenuItem>
          </Select>
        </FormControl>
        <Button className="bg-stone-600 text-white" onClick={joinRoom}>
          Join Room
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
