import { Box, Spinner, Text } from "@chakra-ui/react";
import SimpleSidebar from "./MainLayout";
import { SignIn } from "../SignIn";
import firebaseServices from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = firebaseServices;
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }
  if (!user) {
    return <SignIn />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box display={{ base: 'block', md: 'none' }} p="4" textAlign="center">

        <Text fontSize="lg" color="red.500" mt="300px">

          このサイトは現在モバイル幅に対応していません。PCでのご利用をお願いいたします🙇🙇</Text>
    
      </Box>
      <Box display={{ base: 'none', md: 'flex' }} flex="1">
        <SimpleSidebar />
        <Box ml={{ base: 0, md: 80 }} p="4" flex="1">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
