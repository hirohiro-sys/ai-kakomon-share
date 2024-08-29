import {
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
import { RiShieldKeyholeFill } from "react-icons/ri";

export const SignIn = () => {
  const {auth} = firebaseServices;
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
    <Center h="90vh">
      <Card p="10" maxW="lg" boxShadow="lg">
        <CardHeader>
            <Stack align="center">
              <RiShieldKeyholeFill size="30px" />
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
