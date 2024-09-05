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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  Box,
  List,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Post } from "../domain/kakomon-share";
import { addKakomonPost, getKakomonPosts } from "../lib/supabasefunctions";
import { SubmitHandler, useForm } from "react-hook-form";

type formInputs = {
  title: string;
  name: string;
  description: string;
};

export const CreatePost = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [kakomonPosts, setKakomonPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const addPostModal = useDisclosure();
  const chatModal = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formInputs>();

  const onClickAddKakomonPost: SubmitHandler<formInputs> = async (data) => {
    await addKakomonPost(data.title, data.name, data.description);
    const newKakomonPosts = await getKakomonPosts();
    setKakomonPosts(newKakomonPosts);
    reset({ title: "", name: "", description: "" });
    addPostModal.onClose();
  };
  const handleChatOpen = (post: Post) => {
    setSelectedPost(post);
    chatModal.onOpen();
  };

  useEffect(() => {
    const fetchKakomonPosts = async () => {
      setIsLoading(true);
      const kakomonPosts = await getKakomonPosts();
      setKakomonPosts(kakomonPosts);
      setIsLoading(false);
    };
    fetchKakomonPosts();
  }, []);

  if (isLoading) {
    return <div>ローディング中</div>;
  }

  return (
    <>
      {/* 過去問募集投稿をする際にモーダル表示 */}
      <Modal isOpen={addPostModal.isOpen} onClose={addPostModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>投稿内容を入力してください</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onClickAddKakomonPost)}>
              <FormControl isInvalid={Boolean(errors.title)}>
                <FormLabel htmlFor="title" fontWeight="bold">
                  タイトル
                </FormLabel>
                <Input
                  id="title"
                  placeholder="タイトルを入力してください。"
                  {...register("title", {
                    required: "⚠️タイトルは必須入力項目です。",
                  })}
                />
                <FormErrorMessage>
                  {errors.title && errors.title?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.name)}>
                <FormLabel htmlFor="name" fontWeight="bold" mt="15px">
                  カカオID又はニックネーム
                </FormLabel>
                <Input
                  id="name"
                  placeholder="お名前を入力してください。"
                  {...register("name", {
                    required: "⚠️お名前は必須入力項目です。",
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.description)}>
                <FormLabel htmlFor="description" fontWeight="bold" mt="15px">
                  過去問詳細
                </FormLabel>
                <Textarea
                  id="description"
                  placeholder="過去問の詳細を入力してください。"
                  {...register("description", {
                    required: "⚠️過去問詳細は必須入力項目です。",
                  })}
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </FormControl>
                <Button colorScheme="teal" type="submit" w="100%" mt="20px" mb="10px">
                  投稿する
                </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* chatのモーダル表示 */}
      <Modal isOpen={chatModal.isOpen} onClose={chatModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>掲示板</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPost && (
              <>
                <Box mb="4">
                  <Heading size="md" mb="2">過去問詳細</Heading>
                  <Box p="4" borderWidth="1px" borderRadius="md" bg="gray.50">
                    {selectedPost.description}
                  </Box>
                </Box>
                {/* チャット機能 */}
                <Box>
                  <List spacing={3} mb="4">
                    {/* ここにメッセージリストを表示 */}
                  </List>
                  <FormControl>
                    <FormLabel htmlFor="chatMessage" fontWeight="bold">
                      メッセージ
                    </FormLabel>
                    <Input id="chatMessage" placeholder="メッセージを入力してください。" />
                    <Button colorScheme="teal" mt="2">
                      送信
                    </Button>
                  </FormControl>
                </Box>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* 以下過去問募集のメインページ */}
      <Center mb="30px">
        <Stack>
          <Heading>過去問募集ページ</Heading>
          <Button
            bgColor="teal.400"
            color="white"
            border="2px"
            borderColor="gray.100"
            _hover={{
              bgColor: "white",
              color: "teal.400",
              borderColor: "teal.400",
            }}
            onClick={addPostModal.onOpen}
          >
            過去問を募集する
          </Button>
        </Stack>
      </Center>
      <TableContainer>
        <Table variant="simple" size="lg" colorScheme="blackAlpha">
          <Thead>
            <Tr>
              <Th fontWeight="bold" fontSize="lg">
                タイトル
              </Th>
              <Th fontWeight="bold" fontSize="lg">
                カカオID又はニックネーム
              </Th>
              <Th fontWeight="bold" fontSize="lg">
                過去問詳細
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {kakomonPosts.map((kakomonPost) => (
              <Tr key={kakomonPost.id}>
                <Td>{kakomonPost.title}</Td>
                <Td>{kakomonPost.name}</Td>
                <Td isTruncated maxW="150px">
                  {kakomonPost.description}
                </Td>
                <Td>
                  <Button bgColor="gray.300" onClick={()=>handleChatOpen(kakomonPost)}>
                    詳細
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
