"use client";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { IconType } from "react-icons";
import { FaSignOutAlt, FaClipboardList, FaUser } from "react-icons/fa";
import { MdLaptopChromebook } from "react-icons/md";
import React, { ReactText, useRef } from "react";
import { signOut } from "firebase/auth";
import firebaseServices from "../../firebase";
import { useNavigate } from "react-router-dom";

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "過去問募集ページ", icon: FaClipboardList, path: "/" },
  { name: "貢献する", icon: FaUser, path: "/contributors" },
  { name: "このアプリについて", icon: MdLaptopChromebook, path: "/detail-app" },
];

export default function SimpleSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const bg = useColorModeValue("gray.100", "gray.900");
  const sidebarBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mobileNavBg = useColorModeValue("white", "gray.900");
  const mobileBorderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box minH="100vh" bg={bg}>
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
        navigate={navigate}
        bg={sidebarBg}
        borderColor={borderColor}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            navigate={navigate}
            bg={sidebarBg}
            borderColor={borderColor}
          />
        </DrawerContent>
      </Drawer>
      <MobileNav
        display={{ base: "flex", md: "none" }}
        onOpen={onOpen}
        bg={mobileNavBg}
        borderColor={mobileBorderColor}
      />
      {/* md: 60が初期値 */}
      <Box ml={{ base: 0 }} p="4">
        {/* ここで各コンポーネントの中身を表示 */}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  navigate: (path: string) => void;
  bg: string;
  borderColor: string;
}

const SidebarContent = ({
  onClose,
  navigate,
  bg,
  borderColor,
  ...rest
}: SidebarProps) => {
  const { auth } = firebaseServices;
  const { isOpen, onOpen, onClose: onDialogClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/signin");
    });
  };
  return (
    <Box
      bg={bg}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: "full", md: 80 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        justifyContent="space-between"
        bgColor="blue.300"
        bgGradient="linear(to-r, blackAlpha.700, blue.600, cyan.500)"
      >
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          m="auto"
          color="white"
          textShadow="5px 5px 8px rgba(0, 0, 0, 0.9)"
        >
          KakomonShare
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          mt="10px"
          onClick={() => {
            navigate(link.path);
            onClose();
          }}
        >
          {link.name}
        </NavItem>
      ))}
      <Button
        onClick={onOpen}
        position="fixed"
        bottom="20px"
        left="70px"
        color="red.400"
        bgColor="white"
        border="2px"
      >
        サインアウト
        <FaSignOutAlt />
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              サインアウトページ
            </AlertDialogHeader>

            <AlertDialogBody>本当にサインアウトしますか？</AlertDialogBody>

            <AlertDialogFooter>
                <Button colorScheme="red" onClick={() => { handleSignOut(); onDialogClose(); }} mr="3">
                  サインアウト
                </Button>
                <Button ref={cancelRef} onClick={onDialogClose} variant="outline">
                  キャンセル
                </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  onClick: () => void;
}

const NavItem = ({ icon, children, onClick, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      onClick={onClick}
    >
      <Flex
        align="center"
        p="5"
        mx="3"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        transition="transform 0.2s ease, box-shadow 0.2s ease"
        _hover={{
          bg: "rgba(172, 161, 161, 0.2)",
          transform: "scale(1.03)",

          color: "black",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "black",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  bg: string;
  borderColor: string;
}

const MobileNav = ({ onOpen, bg, borderColor, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={bg}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        KakomonShare
      </Text>
    </Flex>
  );
};
