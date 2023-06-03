import React, { useContext, useState } from "react";
import { Box } from "@chakra-ui/react";
import { ChatContext } from "../context/chatProvider.js";

import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats.js";
import ChatBox from "../components/ChatBox.js";

const ChatPage = () => {
  const { user, setUser } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h="91.5vh"
        padding={"10px"}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
