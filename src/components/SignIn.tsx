import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Stack,
  Text,
  Box,
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
    <Box
      h="100vh"
      bgGradient="linear(to-r, blackAlpha.500, blue.500,cyan.400)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Card p="10" mb="20px" maxW="lg" boxShadow="xl" bgColor="gray.50" borderRadius="30px">
        <CardHeader>
          <Stack align="center">
            <FaDoorOpen size="30px" />
            <Heading size="lg" data-testid="auth-page-title">
              Sign in
            </Heading>
            <Text mt="4" textAlign="center" fontSize="sm">
              Please sign in with your Google or GitHub account！
            </Text>
          </Stack>
        </CardHeader>
        <Divider borderColor="gray.400" />
        <CardBody>
          <Stack>
            <Button
              onClick={signInWithGoogle}
              fontSize="20px"
              p="25px"
              border="1px"
            >
              <FcGoogle size="30px" style={{ marginRight: "8px" }} />
              Googleでログイン
            </Button>
            <Button
              onClick={signInWithGithub}
              fontSize="20px"
              p="25px"
              border="1px"
            >
              <FaGithub size="30px" style={{ marginRight: "8px" }} />
              Githubでログイン
            </Button>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};
