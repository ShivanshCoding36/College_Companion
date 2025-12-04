import React, { createContext, useContext, useState } from "react";

const RoomContext = createContext();

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within RoomProvider");
  }
  return context;
};

export const RoomProvider = ({ children }) => {
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [roomData, setRoomData] = useState(null);

  const enterRoom = (roomCode, roomInfo) => {
    setActiveRoomId(roomCode);
    setRoomData(roomInfo);
  };

  const exitRoom = () => {
    setActiveRoomId(null);
    setRoomData(null);
  };

  const value = {
    activeRoomId,
    roomData,
    enterRoom,
    exitRoom,
    isInRoom: !!activeRoomId
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
