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
import { getSubjects } from "../lib/supabasefunctions";
import { Subject } from "../domain/kakomon-share";
import { SubmitHandler, useForm } from "react-hook-form";

type formInputs = {
  name: string;
  kakaoId: string;
};

export const Contributors = () => {
  const [subject1, setSubject1] = useState<Subject[]>([]);
  // const [subject2, setSubject2] = useState<Subject[]>([]);
  // const [subject3, setSubject3] = useState<Subject[]>([]);
  // const [subject4, setSubject4] = useState<Subject[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formInputs>();

  // 科目一覧を取得する関数(現状1年生のみ)
  useEffect(() => {
    const fetchSubjects = async () => {
      const subjects = await getSubjects();
      setSubject1(subjects);
    };
    fetchSubjects();
  }, []);

  // 科目別過去問に対するカカオIDの追加をする関数
  const onClickAddKakaoId: SubmitHandler<formInputs> = async (data) => {
    console.log(data);
    reset({ name: "", kakaoId: "" });
    onClose();
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

        <TabPanels>
          {/*----------1年生エリア(ここはsupabaseから科目名を引っ張ってきている)----------*/}
          <TabPanel>
            <Accordion allowMultiple>
              {subject1.map((subject) => (
                <AccordionItem key={subject.id}>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                      {subject.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>- demo-id</AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </TabPanel>

          {/*----------2年生エリア(現状科目名はハードコーディングしている)----------*/}
          <TabPanel>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    ソフトウェア工学概論
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
                        <Tr>
                          <Td>kato</Td>
                          <Td>demo-id</Td>
                          <Td>中間の過去問はありますが、期末のはありません。カカオIDからご連絡ください。</Td>
                        </Tr>
                        <Tr>
                          <Td>hirokazu</Td>
                          <Td>demo-id</Td>
                          <Td>試験の過去問はありませんが、課題の過去問はあります。いつでも連絡ください。</Td>
                        </Tr>
                      </Tbody>
    
                    </Table>
                  </TableContainer>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    オープンソースソフトウェア
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    コンピュータデータ構造
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    データサイエンス概論
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    プログラミング応用 I
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    ソフトウェア分析設計
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    webプログラミング
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    コンピュータアルゴリズム
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    人工知能数学
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    プログラミング応用 II
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>
            </Accordion>
          </TabPanel>

          {/*----------3年生エリア----------*/}
          <TabPanel>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    統計的推論
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    パターン認識と機械学習
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    IT産業トレンドと進路
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    DB設計活用
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    人工知能概論
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    ソフトウェアプロジェクト基礎
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    コンピュータビジョン
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    ソーシャルネットワーク分析
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    ソフトウェア品質管理
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    就業外国語実務
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    MLOps
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    人工知能工学
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    ソフトウェアプロジェクト応用
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>
            </Accordion>
          </TabPanel>

          {/*----------4年生エリア----------*/}
          <TabPanel>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    AR/VR
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    IT技術マーケティング方法論
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    情報分析
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    データ視覚化
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    ソフトウェアプロジェクト深化
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    ロボティクス
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    コンピュータ保安
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    AI/SW新技術セミナー
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    webインテリジェンス
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    産学協力SWプロジェクト
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>- demo-id</AccordionPanel>
              </AccordionItem>
            </Accordion>
          </TabPanel>
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
