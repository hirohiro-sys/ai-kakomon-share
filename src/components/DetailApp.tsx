import {
  Avatar,
  Badge,
  Box,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FaGithub, FaSquareXTwitter } from "react-icons/fa6";
import { SiQiita } from "react-icons/si";

export const DetailApp = () => {
  return (
    <>
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
              data-testid="detail-page-title"
            >
              管理者ページ
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
          <Card maxW="md" m="auto" mt="20px" variant="outline" boxShadow="lg">
            <CardBody m="auto">
              <Flex gap="4" alignItems="center" mb="20px">
                <Avatar />
                <Box>
                  <Heading size="sm">BisketOriba</Heading>
                  <Text>Creator, KakomonShare</Text>
                </Box>
              </Flex>
              <Badge variant="solid">自己紹介</Badge>
              <Text>
                KakomonShare管理者のbisketoribaです。アプリの不具合、要望などありましたらお気軽にお知らせください。一緒に機能追加してくれる方も募集中です。
              </Text>
              <Divider mt="10px" borderColor="gray.400" />
              <Flex gap="20" mt="20px" justifyContent="center">
                <Text fontSize="3xl">
                  <a
                    href="https://github.com/hirohiro-sys"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub />
                  </a>
                </Text>
                <Text fontSize="3xl">
                  <a
                    href="https://qiita.com/bisketoriba"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiQiita />
                  </a>
                </Text>
                <Text fontSize="3xl">
                  <a
                    href="https://x.com/qhcSEiFAQg5454"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaSquareXTwitter />
                  </a>
                </Text>
              </Flex>
            </CardBody>
          </Card>
        </Stack>
      </Center>
      {/* 現状更新情報はハードコーディングしている(本当はここもDBで管理したほうが良さそう) */}
      <Text fontSize="30px" fontWeight="bold" mt="50px">
        <Text as="span" fontSize="36px" color="green.500">
          更
        </Text>
        新情報
      </Text>
      <Divider mt="10px" borderColor="gray.400" />
      <Flex mt="20px">
      <Badge colorScheme="red" fontSize='1.5em' mr="10px" borderRadius="md">新着</Badge>
      <Text fontSize="1.5em">【2024/09/14】 デモ実装完了🎉</Text>
      </Flex>
      <Flex mt="20px">
      <Badge  fontSize='1.5em' mr="10px" variant="solid" borderRadius="md">お知らせ</Badge>
      <Text fontSize="1.5em">【2024/09/01】 KakomonShare実装着手💪</Text>
      </Flex>
    </>
  );
};
