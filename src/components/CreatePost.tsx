import {
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Center,
  Stack,

} from "@chakra-ui/react";




export const CreatePost = () => {

  
  return (
    <>
      {/* ログイン成功時のアラート */}
      {/* 以下過去問募集のメインページ */}
      <Center mb="30px">
        <Stack>
          <Heading>過去問募集ページ</Heading>
          <Button bgColor="teal.300" color="white">過去問を募集する</Button>
        </Stack>
      </Center>
      <TableContainer>
        <Table variant="simple" size="lg" colorScheme="blackAlpha">
          <Thead>
            <Tr>
              <Th fontWeight="bold" fontSize="lg" >
                タイトル
              </Th>
              <Th fontWeight="bold" fontSize="lg">
                カカオID又はニックネーム
              </Th>
              <Th fontWeight="bold" fontSize="lg">
                過去問詳細
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>~~の過去問が欲しいです</Td>
              <Td>demo-id</Td>
              <Td isTruncated maxW="150px">
                XXXXXXXXXXXXXXXXXXXXXXXXXXXX
              </Td>
            </Tr>
    
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
