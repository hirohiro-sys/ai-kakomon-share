import React from 'react';
import { Box, Heading, Text} from '@chakra-ui/react';

export const Page404 = () => {

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="gray.100"
      textAlign="center"
      p={5}
    >
      <Heading as="h1" size="2xl" mb={4}>
        404
      </Heading>
      <Text fontSize="xl" mb={6}>
        このページは存在しません。URLを確認してください。
      </Text>
    </Box>
  );
};
