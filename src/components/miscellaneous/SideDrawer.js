import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";

import { ChatContext } from "../../context/chatProvider";
import React, { useContext, useState } from "react";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { base_url } from "../../assets/api";
import { getSender } from "../config/ChatLogics";

// import NotificationBadge from 'react-notification-badge';
// import {Effect} from 'react-notification-badge';

const SideDrawer = () => {
  const [seacrh, setSearch] = useState("");
  const [seacrhResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    user,
    setUser,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useContext(ChatContext);

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${base_url}/api/chat`,
        { userId },
        config
      );
      // console.log(userId,chats,data,"chatsss")

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        status: "warning",
        duration: 3000,
        description: error.message,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!seacrh) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${base_url}/api/user?search=${seacrh}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Chatty
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              {/* <NotificationBadge
                count={notification.length}
              /> */}
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(
                      notification.filter((n) => (n) => n !== notif)
                    );
                  }}
                >
                  {notif.chat.isgroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logOutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* side drawer */}

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={seacrh}
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              seacrhResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
