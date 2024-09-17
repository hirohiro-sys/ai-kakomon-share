import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Center,
  Editable,
  EditablePreview,
  EditableTextarea,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useEditableControls,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  addUser,
  addUserToSubject,
  getSubjects,
  getSubjectUserIds,
  getUserInfo,
  updateUserInfo,
} from "../lib/supabasefunctions";
import { Subject, User } from "../domain/kakomon-share";
import { SubmitHandler, useForm } from "react-hook-form";
import { getAuth } from "firebase/auth";
import { FaPenToSquare } from "react-icons/fa6";

type formInputs = {
  name: string;
  subjectName: string;
  kakaoId: string;
  description: string;
};

export const Contributors = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [userInfoBySubject, setUserInfoBySubject] = useState<
    // key(科目名)が文字列でvalue(ユーザー情報)がuser型のstate
    Record<string, User[]>
  >({});
  const { isOpen, onClose, onOpen } = useDisclosure();
  const Toast = useToast();

  const EditableControls = () => {
    const {
      isEditing,
      getEditButtonProps,
      getCancelButtonProps,
      getSubmitButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <span>
        <Button size="sm" {...getSubmitButtonProps()} colorScheme="blue">
          保存する
        </Button>
        <Button size="sm" {...getCancelButtonProps()} ml="2">
          キャンセル
        </Button>
      </span>
    ) : (
      <Button
        size="sm"
        {...getEditButtonProps()}
        colorScheme="teal"
        ml="20px"
      >
        <FaPenToSquare />
      </Button>
    );
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formInputs>();

  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;

  // 科目情報を取得する関数
  useEffect(() => {
    const fetchSubjectsData = async () => {
      const subjects = await getSubjects();
      setSubjects(subjects);

      // 各科目のユーザー情報を取得
      const userInfosBySubject = await Promise.all(
        subjects.map(async (subject) => {
          const userInfos = await fetchUserInfoBySubjectId(subject.id);
          return { subjectId: subject.id, userInfos };
        })
      );

      const userInfoBySubjectMap = userInfosBySubject.reduce(
        (acc, { subjectId, userInfos }) => {
          acc[subjectId] = userInfos.flat();
          return acc;
        },
        {} as Record<string, User[]>
      );

      setUserInfoBySubject(userInfoBySubjectMap);
    };
    fetchSubjectsData();
  }, []);

  // 科目ごとのユーザー情報を取得する関数
  const fetchUserInfoBySubjectId = async (subjectId: number) => {
    const userIds = await getSubjectUserIds(subjectId);
    if (!userIds) {
      console.log("ユーザーが存在しません。");
      return [];
    }
    const userInfos = await Promise.all(
      userIds.map((userId) => getUserInfo(userId.user_id))
    );
    return userInfos;
  };

  // 科目の学年でフィルタリングして表示させるための関数
  const getSubjectsByGrade = (year: string) => {
    return subjects.filter((subject) => subject.year === year);
  };

  // 科目別過去問に対するカカオIDの追加をする関数
  const onClickAddUserInfo: SubmitHandler<formInputs> = async (data) => {
    // console.log(data);
    const userId = await addUser(
      data.name,
      Number(data.subjectName),
      data.kakaoId,
      data.description,
      currentUserId!
    );
    await addUserToSubject(Number(data.subjectName), userId);

    // 科目とユーザー情報を再取得(をしないとリロードしないと画面に反映されない)
    const updatedSubjects = await getSubjects();
    setSubjects(updatedSubjects);
    const userInfosBySubject = await Promise.all(
      updatedSubjects.map(async (subject) => {
        const userInfos = await fetchUserInfoBySubjectId(subject.id);
        return { subjectId: subject.id, userInfos };
      })
    );
    const userInfoBySubjectMap = userInfosBySubject.reduce(
      (acc, { subjectId, userInfos }) => {
        acc[subjectId] = userInfos.flat();
        return acc;
      },
      {} as Record<string, User[]>
    );
    setUserInfoBySubject(userInfoBySubjectMap);

    reset({ name: "", subjectName: "", kakaoId: "", description: "" });
    Toast({
      title: "登録に成功しました！",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
    onClose();
  };

  // ユーザーの備考欄を更新する関数
  const handleDescriptionChange = async (
    userId: number,
    newDescription: string
  ) => {
    await updateUserInfo(userId, newDescription);
    const updatedSubjects = await getSubjects();
    setSubjects(updatedSubjects);
    const userInfosBySubject = await Promise.all(
      updatedSubjects.map(async (subject) => {
        const userInfos = await fetchUserInfoBySubjectId(subject.id);
        return { subjectId: subject.id, userInfos };
      })
    );
    const userInfoBySubjectMap = userInfosBySubject.reduce(
      (acc, { subjectId, userInfos }) => {
        acc[subjectId] = userInfos.flat();
        return acc;
      },
      {} as Record<string, User[]>
    );
    setUserInfoBySubject(userInfoBySubjectMap);
  };

  return (
    <>
      {/* 過去問投稿モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>登録内容を入力してください</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onClickAddUserInfo)}>
              <FormControl isInvalid={Boolean(errors.name)}>
                <FormLabel htmlFor="name" fontWeight="bold">
                  <Badge colorScheme="red" mr="3px">
                    必須
                  </Badge>
                  お名前
                </FormLabel>
                <Input
                  id="name"
                  data-testid="name-input"
                  placeholder="お名前を入力してください。"
                  {...register("name", {
                    required: "⚠️お名前は必須入力項目です。",
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.kakaoId)}>
                <FormLabel htmlFor="kakaoId" fontWeight="bold" mt="15px">
                  <Badge colorScheme="red" mr="3px">
                    必須
                  </Badge>
                  カカオID
                </FormLabel>
                <Input
                  id="kakaoId"
                  placeholder="カカオIDを入力してください。"
                  data-testid="kakaoId-input"
                  {...register("kakaoId", {
                    required: "⚠️カカオIDは必須入力項目です。",
                  })}
                />
                <FormErrorMessage>
                  {errors.kakaoId && errors.kakaoId.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.subjectName)}>
                <FormLabel htmlFor="subject-name" fontWeight="bold" mt="15px">
                  <Badge colorScheme="red" mr="3px">
                    必須
                  </Badge>
                  科目名
                </FormLabel>
                <Select
                  id="subject-name"
                  variant="outline"
                  data-testid="subjectName-input"
                  placeholder="科目を選んでください"
                  {...register("subjectName", {
                    required: "⚠️科目は必須入力項目です。",
                  })}
                >
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.subjectName && errors.subjectName.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="description" fontWeight="bold" mt="15px">
                  <Badge colorScheme="blackAlpha" variant="solid" mr="3px">
                    任意
                  </Badge>
                  補足 （ここは後で編集可能です）
                </FormLabel>
                <Textarea
                  id="description"
                  placeholder="例) 中間の過去問はありますが、期末の過去問はありません。"
                  {...register("description")}
                />
              </FormControl>

              <Button
                colorScheme="teal"
                type="submit"
                w="100%"
                mt="20px"
                mb="10px"
                data-testid="kakomon-register-button"
              >
                登録する
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 科目別過去問情報ページのメインレイアウト */}
      <Center>
        <Stack>
        <Box position="relative" padding="1rem .5rem" mb={5}>
            <Heading
              fontFamily="serif"
              fontSize="50px"
              textAlign="center"
              textShadow="3px 3px 6px rgba(0, 0, 0, 0.4)"
              color="blackAlpha.700"
              letterSpacing="wide"
              fontWeight="bold"
              data-testid="kakomon-register-title"
            >
              過去問登録ページ
            </Heading>
            <Box
              position="absolute"
              bottom="0"
              left="0"
              width="100%"
              height="4px"
              content='""'
              backgroundImage="linear-gradient(to left, #30cfd0 0%, #330867 100%)"
            />
          </Box>

          <Text
            fontSize="sm"
            textAlign="center"
            fontWeight="semibold"
            mb="5px"
            fontStyle="italic"
          >
            ここでは試験や課題の過去問を登録し閲覧できます。
          </Text>

          <Button
            bgColor="blackAlpha.700"
            color="white"
            border="2px"
            mb="30px"
            borderRadius="full"
            onClick={onOpen}
            data-testid="kakomon-register-modal"
            _hover={{
              bgColor: "white",
              color: "blackAlpha.700",
              borderColor: "blackAlpha.700",
            }}
          >
            過去問を登録する
          </Button>
        </Stack>
      </Center>
      <Tabs isFitted variant="enclosed-colored">
        <TabList>
          <Tab>1年生の科目</Tab>
          <Tab>2年生の科目</Tab>
          <Tab>3年生の科目</Tab>
          <Tab>4年生の科目</Tab>
        </TabList>

        {/* 科目を表示している箇所 */}
        <TabPanels>
          {["1", "2", "3", "4"].map((year) => (
            <TabPanel key={year}>
              <Accordion allowMultiple>
                {getSubjectsByGrade(year).map((subject) => (
                  <AccordionItem key={subject.id}>
                    <AccordionButton>
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        fontWeight="bold"
                      >
                        {subject.name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <TableContainer>
                        <Table size="sm">
                          {userInfoBySubject[subject.id]?.length ? (
                            <>
                              <Thead>
                                <Tr>
                                  <Th>お名前</Th>
                                  <Th>カカオID</Th>
                                  <Th>補足</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {userInfoBySubject[subject.id].map((user) => (
                                  <Tr key={user.id}>
                                    <Td>{user.name}</Td>
                                    <Td>{user.kakao_id}</Td>
                                    <Td maxW="200px">
                                      <Editable
                                        defaultValue={user.description}
                                        onSubmit={(newDescription) =>
                                          handleDescriptionChange(
                                            user.id,
                                            newDescription
                                          )
                                        }
                                        isPreviewFocusable={false}
                                      >
                                        <EditablePreview />
                                        <EditableTextarea
                                          w="70%"
                                          maxW="600px"
                                          minH="50px"
                                          mb="-15px"
                                          mr="10px"
                                        />
                                        {user.firebase_user_id ===
                                        currentUserId ? (
                                          <EditableControls />
                                        ) : (
                                          <Badge
                                            colorScheme="blackAlpha"
                                            variant="solid"
                                          >
                                            編集権限がありません
                                          </Badge>
                                        )}
                                      </Editable>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </>
                          ) : (
                            // table内でTextのみを使うとコンソールで警告が出る
                            <Tbody>
                              <Tr>
                                <Td colSpan={1}>ユーザー情報がありません。</Td>
                              </Tr>
                            </Tbody>
                          )}
                        </Table>
                      </TableContainer>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {/* フッター */}
      <Box
        as="footer"
        bg="gray.50"
        color="blackAlpha.700"
        py="4"
        textAlign="center"
        mt="auto"
      >
        <Text mb="2">
          <i>© AIソフトウェア学部 過去問一覧ページ</i>
        </Text>
      </Box>
    </>
  );
};
