import React from "react";
import { SignIn } from "./SignIn";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { Button } from "@chakra-ui/react";
import { signOut } from "firebase/auth";

export const CreatePost = () => {
  const [user] = useAuthState(auth);
  return <>{user ? (
  <>
  <div>ここに過去問を投稿できるようにします</div>
  <Button onClick={() => signOut(auth)}>サインアウト</Button>
  </>
) : <SignIn />}</>;
};
