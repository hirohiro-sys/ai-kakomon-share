import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
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
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getSubjects, getSubjectUserIds, getUserInfo } from "../lib/supabasefunctions";
import { Subject, User } from "../domain/kakomon-share";
import { SubmitHandler, useForm } from "react-hook-form";

type formInputs = {
  name: string;
  kakaoId: string;
};

export const Contributors = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [userInfo, setUserInfo] = useState<User[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formInputs>();

  // 科目情報を取得する関数
  useEffect(() => {
    const fetchSubjectsData = async () => {
      // ここで全科目を取得
      const subjects = await getSubjects();
      setSubjects(subjects);
      // ここで科目ごとのユーザー情報を取得したい
      const userIds = await getSubjectUserIds(subjects.id);
      if (!userIds) {
        console.log("ユーザーが存在しません。");
        return;
      }
      const userInfo = await getUserInfo(userIds.user_id)
      setUserInfo(userInfo);
    };
    fetchSubjectsData();
  }, []);

  // 科目別過去問に対するカカオIDの追加をする関数
  const onClickAddKakaoId: SubmitHandler<formInputs> = async (data) => {
    console.log(data);
    reset({ name: "", kakaoId: "" });
    onClose();
  };

  // 科目の学年でフィルタリングして表示させるための関数
  const getSubjectsByGrade = (year: string) => {
    return subjects.filter(subject => subject.year === year);
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
            <form onSubmit={handleSubmit(onClickAddKakaoId)}>
              <FormControl isInvalid={Boolean(errors.name)}>
                <FormLabel htmlFor="name" fontWeight="bold" mt="15px">
                  科目名
                </FormLabel>
                <Input
                  id="name"
                  placeholder="科目名を入力してください。"
                  {...register("name", {
                    required: "⚠️科目名は必須入力項目です。",
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.kakaoId)}>
                <FormLabel htmlFor="kakaoId" fontWeight="bold">
                  カカオID
                </FormLabel>
                <Input
                  id="kakaoId"
                  placeholder="カカオIDを入力してください。"
                  {...register("kakaoId", {
                    required: "⚠️カカオIDは必須入力項目です。",
                  })}
                />
                <FormErrorMessage>
                  {errors.kakaoId && errors.kakaoId.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                colorScheme="teal"
                type="submit"
                w="100%"
                mt="20px"
                mb="10px"
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
          <Heading
            fontFamily="serif"
            fontSize="50px"
            textAlign="center"
            textShadow="2px 2px 4px rgba(0, 0, 0, 0.3)"
          >
            過去問登録ページ
          </Heading>
          <Button
            bgColor="blackAlpha.700"
            color="white"
            border="2px"
            mb="30px"
            onClick={onOpen}
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
        {["1", "2", "3", "4"].map(year => (
          <TabPanel key={year}>
            <Accordion allowMultiple>
              {getSubjectsByGrade(year).map(subject => (
                <AccordionItem key={subject.id}>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                      {subject.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                  <TableContainer>
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th>お名前</Th>
                          <Th>カカオID</Th>
                          <Th>補足</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {userInfo.map(user => (
                          <Tr key={user.id}>
                            <Td>{user.name}</Td>
                            <Td>{user.kakao_id}</Td>
                            <Td>{user.description}</Td>
                          </Tr>
                        ))}
                      </Tbody>
    
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
