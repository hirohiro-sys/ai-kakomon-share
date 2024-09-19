import { ChakraProvider } from "@chakra-ui/react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { CreatePost } from "../components/CreatePost";
import userEvent from "@testing-library/user-event";

const initialMockDataComment = [
  {
    id: 1,
    title: "test",
    name: "テスト太郎",
    comment: "これはテストです(コメント版)。",
    created_at: "2021-10-01T00:00:00.000Z",
  },
];
const addMockDataComment = [
  {
    id: 1,
    title: "test",
    name: "テスト太郎",
    comment: "これはテストです(コメント版)。",
    created_at: "2021-10-01T00:00:00.000Z",
  },
  {
    id: 2,
    title: "test",
    name: "テスト二郎",
    comment: "これは追加されたコメントです。",
    created_at: "2021-10-01T00:00:00.000Z",
  },
];
const mockGetKakomonPosts = jest.fn().mockResolvedValue([
  {
    id: 1,
    title: "test",
    name: "ユーザー1",
    description: "過去問の詳細1",
  },
]);
const mockGetKakomonPostComments = jest
  .fn()
  .mockResolvedValueOnce(initialMockDataComment)
  .mockResolvedValue(addMockDataComment);

jest.mock("../lib/supabasefunctions", () => {
  return {
    getKakomonPosts: () => mockGetKakomonPosts(),
    getKakomonPostComments: () => mockGetKakomonPostComments(),
    addKakomonPostComment: jest.fn(),
  };
});


// なぜかコメント追加のテストが通らなかったので別ファイルに切り出している(ここでは通る)
describe("過去問の募集投稿ページのテスト(コメント版)", () => {
  test("コメントが追加できる", async () => {
    await act(async () => {
      render(
        <ChakraProvider>
          <CreatePost />
        </ChakraProvider>
      );
    });
    await waitFor(() => {
      const recordList = screen.getByTestId("record-list");
      expect(recordList).toBeInTheDocument();
    });
    const detailButton = screen.getAllByTestId("detail-modal-button")[0];
    await act(async () => {
      detailButton.click();
    });
    await waitFor(() => {
      expect(screen.getAllByTestId("comment-item")).toHaveLength(1);
    });
    // screen.debug();
    const nameInput = await screen.findByTestId("comment-name-input");
    await act(async () => {
      await userEvent.type(nameInput, "テスト太郎");
    });

    const commentInput = screen.getByTestId("comment-input");
    await act(async () => {
      await userEvent.type(commentInput, "コメントです。");
    });
    await act(async () => {
      userEvent.click(screen.getByTestId("send-comment-button"));
    });
    await waitFor(() => {
      expect(screen.getAllByTestId("comment-item")).toHaveLength(2);
    });
    // screen.debug();
  });
});
