import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Heading,
  Stack,
  Text,
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
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
  const { auth } = firebaseServices;
  const navigate = useNavigate();
  const signInWithGoogle = (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then((result) => {
      // サインイン成功後にリダイレクト
      navigate("/");
      return result;
    });
  };

  const signInWithGithub = (): Promise<UserCredential> => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider).then((result) => {
      // サインイン成功後にリダイレクト
      navigate("/");
      return result;
    });
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
              <FaDoorOpen size="30px" />

              <Heading size="lg">Sign in</Heading>
              <Text mt="4" textAlign="center" fontSize="sm">
                Please sign in with your Google or GitHub account！
              </Text>
            </Stack>
          </CardHeader>
          <Divider borderColor="gray.400"/>
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
