import React, { useEffect } from "react";
import {
  Box,
  Container,
  Text,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";

import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        p={3}
        bg={"white"}
        w={"100%"}
        m={"$0px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text
          display={"flex"}
          justifyContent={"center"}
          fontSize={"4xl"}
          fontFamily={"Work Sans"}
        >
          Chatty
        </Text>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        borderRadius="lg"
        color={"black"}
        borderWidth={"1px"}
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1rem">
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
