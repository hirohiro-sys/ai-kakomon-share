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
  Divider,
  Spinner,
  ListItem,
  Flex,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Post, Comment } from "../domain/kakomon-share";
import {
  addKakomonPost,
  addKakomonPostComment,
  getKakomonPostComments,
  getKakomonPosts,
} from "../lib/supabasefunctions";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { IoSend } from "react-icons/io5";

type formInputs = {
  title: string;
  name: string;
  description: string;
};

export const CreatePost = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [kakomonPosts, setKakomonPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");

  const addPostModal = useDisclosure();
  const chatModal = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formInputs>();

  // 過去問の募集投稿をする関数
  const onClickAddKakomonPost: SubmitHandler<formInputs> = async (data) => {
    await addKakomonPost(data.title, data.name, data.description);
    const newKakomonPosts = await getKakomonPosts();
    setKakomonPosts(newKakomonPosts);
    reset({ title: "", name: "", description: "" });
    addPostModal.onClose();
  };
  // 過去問の募集投稿の内容を取得しモーダルを開く関数
  const handleChatOpen = async (post: Post) => {
    setSelectedPost(post);
    const comments = await getKakomonPostComments(post.title);
    setPostComments(comments);
    chatModal.onOpen();
  };

  // 過去問募集投稿を取得する処理
  useEffect(() => {
    const fetchKakomonPosts = async () => {
      setIsLoading(true);
      const kakomonPosts = await getKakomonPosts();
      setKakomonPosts(kakomonPosts);
      setIsLoading(false);
    };
    fetchKakomonPosts();
  }, []);

  // 過去問募集投稿に対するコメントを追加
  const onClickAddComment = async () => {
    if (selectedPost && commentText && commentName) {
      await addKakomonPostComment(selectedPost.title, commentName, commentText);
      const comments = await getKakomonPostComments(selectedPost.title);
      setPostComments(comments);
      setCommentText("");
      setCommentName("");
    }
  };

  if (isLoading) {
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Spinner size="xl" />
    </Box>;
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
                  <Badge colorScheme="red" mr="3px">
                    必須
                  </Badge>
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
                  <Badge colorScheme="red" mr="3px">
                    必須
                  </Badge>
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
                  <Badge colorScheme="red" mr="3px">
                    必須
                  </Badge>
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
              <Button
                colorScheme="teal"
                type="submit"
                w="100%"
                mt="20px"
                mb="10px"
              >
                投稿する
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* chatのモーダル */}
      <Modal isOpen={chatModal.isOpen} onClose={chatModal.onClose}>
        <ModalOverlay />
        <ModalContent maxW="700px">
          <ModalCloseButton />
          <ModalBody>
            {selectedPost && (
              <>
                <Box mb="4">
                  <Heading size="md" mb="2">
                    投稿者: {selectedPost.name}
                  </Heading>
                  <Heading size="md" mb="2">
                    過去問募集詳細
                  </Heading>
                  <Box p="4" borderWidth="1px" borderRadius="md" bg="gray.100">
                    {selectedPost.description}
                  </Box>
                </Box>
                <Box>
                  <Heading size="sm" mb="3">
                    コメント一覧
                  </Heading>
                  <List spacing={4} mb="4">
                    {postComments.length === 0 ? (
                      <ListItem p="3" textAlign="center" color="gray.600">
                        コメントはまだありません。
                      </ListItem>
                    ) : (
                      postComments.map((comment) => (
                        <ListItem
                          key={comment.created_at.toString()}
                          p="3"
                          borderWidth="1px"
                          borderRadius="md"
                          bg="gray.50"
                          boxShadow="md"
                        >
                          <Text fontWeight="bold">{comment.comment}</Text>
                          <Text fontSize="sm" color="gray.500" mt="1">
                            by {comment.name}
                            {comment.name === selectedPost.name ? (
                              <Text
                                as="span"
                                fontWeight="bold"
                                color="teal.500"
                              >
                                {" "}
                                <Badge variant="outline" colorScheme="red">
                                  投稿主
                                </Badge>
                              </Text>
                            ) : (
                              ""
                            )}
                          </Text>
                        </ListItem>
                      ))
                    )}
                  </List>

                  <Divider borderColor="gray.400" mb="4" />

                  <Box mt="4">
                    <FormControl>
                      <FormLabel htmlFor="chatMessage" fontWeight="bold">
                        返信する
                      </FormLabel>
                      <Input
                        placeholder="お名前を入力してください。"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        width="91.5%"
                        mb="3"
                      />
                      <Flex align="center" gap="2">
                        <Textarea
                          id="chatMessage"
                          placeholder="メッセージを入力してください。"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          flex="1"
                          height="40px"
                        />
                        <Button
                          colorScheme="teal"
                          onClick={onClickAddComment}
                          mb="-9"
                        >
                          <IoSend />
                        </Button>
                      </Flex>
                    </FormControl>
                  </Box>
                </Box>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 以下過去問募集のメインページ */}
      <Center mb="30px">
        <Stack>
          <Heading
            fontFamily="serif"
            fontSize="50px"
            textAlign="center"
            textShadow="2px 2px 4px rgba(0, 0, 0, 0.3)"
          >
            過去問募集ページ
          </Heading>

          <Button
            bgColor="blackAlpha.700"
            color="white"
            border="2px"
            _hover={{
              bgColor: "white",
              color: "blackAlpha.700",
              borderColor: "blackAlpha.700",
            }}
            onClick={addPostModal.onOpen}
          >
            過去問を募集する
          </Button>
        </Stack>
      </Center>
      <TableContainer>
        <Table variant="simple" size="sm" colorScheme="blackAlpha">
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
                <Button
                    bgColor="gray.500"
                    color="white"
                    border="2px"
                    borderColor="gray.500"
                    _hover={{
                      bgColor: "white",
                      color: "black",
                      borderColor: "gray.500",
                    }}
                    onClick={() => handleChatOpen(kakomonPost)}
                  >
                    詳細
                    <BiMessageRoundedDetail
                      size="20px"
                      style={{ marginLeft: "8px" }}
                    />
                  </Button>

                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Box
        as="footer"
        bg="gray.50"
        color="blackAlpha.700"
        py="4"
        textAlign="center"
        mt="auto"
      >
        <Text mb="2">
          <i>© AIソフトウェア学部 過去問募集ページ</i>
        </Text>
      </Box>
    </>
  );
};
