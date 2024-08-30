import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Stack,
} from "@chakra-ui/react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import firebaseServices from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaDoorOpen } from "react-icons/fa6";
// import { RiShieldKeyholeFill } from "react-icons/ri";

export const SignIn = () => {
  const { auth } = firebaseServices;
  const signInWithGoogle = (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };
  const signInWithGithub = (): Promise<UserCredential> => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };
  return (
    <>
      <Center h="100vh" position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgImage={`url(https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3279945/533e08f0-f2da-d547-bfcc-276c3123c0ec.jpeg)`}
          bgSize="cover"
          bgPosition="center"
          filter="brightness(70%)"
          zIndex="-1"
        />
        <Card p="10" mb="20px" maxW="lg" boxShadow="lg">
          <CardHeader>
            <Stack align="center">
              {/* <RiShieldKeyholeFill size="30px" /> */}
              <FaDoorOpen size="30px" />

              <Heading size="lg">Sign in</Heading>
            </Stack>
          </CardHeader>
          <CardBody>
            <Stack>
              <Button onClick={signInWithGoogle} fontSize="20px" p="25px">
                <FcGoogle size="30px" style={{ marginRight: "8px" }} />
                Googleでログイン
              </Button>
              <Button onClick={signInWithGithub} fontSize="20px" p="25px">
                <FaGithub size="30px" style={{ marginRight: "8px" }} />
                Githubでログイン
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </Center>
    </>
  );
};
