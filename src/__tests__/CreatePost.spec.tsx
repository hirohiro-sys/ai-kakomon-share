import { render, screen, waitFor } from "@testing-library/react";
import { CreatePost } from "../components/CreatePost";
import { ChakraProvider } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";

const initialMockData = [
  {
    id: 1,
    title: "test",
    name: "テスト太郎",
    description: "これはテストです。",
  },
];
const addMockData = [
  {
    id: 1,
    title: "test",
    name: "テスト太郎",
    description: "これはテストです。",
  },
  {
    id: 2,
    title: "test2",
    name: "テスト二郎",
    description: "これはテストです。",
  },
];

// const initialMockDataComment = [
//   {
//     id: 1,
//     name: "テスト太郎",
//     comment: "これはテストです(コメント版)。",
//   },
// ];
// const addMockDataComment = [
//   {
//     id: 1,
//     name: "テスト太郎",
//     comment: "これはテストです(コメント版)。",
//   },
//   {
//     id: 2,
//     name: "テスト二郎",
//     comment: "これはテストです2(コメント版)。",
//   },
// ];

const mockGetKakomonPosts = jest
  .fn()
  .mockResolvedValueOnce(initialMockData)
  .mockResolvedValueOnce(initialMockData)
  .mockResolvedValueOnce(initialMockData)
  .mockResolvedValue(addMockData);

// const mockGetKakomonPostComments = jest
// .fn()
// .mockResolvedValueOnce(initialMockDataComment)
// .mockResolvedValue(addMockDataComment);

jest.mock("../lib/supabasefunctions", () => {
  return {
    getKakomonPosts: () => mockGetKakomonPosts(),
    addKakomonPost: jest.fn(),
    // getKakomonPostComments: () => mockGetKakomonPostComments(),
    // addKakomonPostComment: jest.fn(),
  };
});

describe("過去問の募集投稿ページのテスト", () => {
  beforeEach(() => {
    render(
      <ChakraProvider>
        <CreatePost />
      </ChakraProvider>
    );
  });
  test("タイトルが見れる", () => {
    expect(screen.getByTestId("kakomon-post-title")).toBeInTheDocument();
  });

  test("フォームのバリデーションが機能する", async () => {
    const postButton = screen.getByTestId("kakomon-post-modal");
    postButton.click();
    const submitButton = await screen.findByTestId("kakomon-post-button");
    submitButton.click();
    expect(
      await screen.findByText("⚠️タイトルは必須入力項目です。")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("⚠️お名前は必須入力項目です。")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("⚠️過去問詳細は必須入力項目です。")
    ).toBeInTheDocument();
  });

  test("過去問の募集投稿をするとレコードが1つ増える", async () => {
    // 1回目のmockResolvedValueOnce
    await waitFor(() => {
      const recordList = screen.getByTestId("record-list");
      expect(recordList).toBeInTheDocument();
      const rows = recordList.querySelectorAll("tr");
      expect(rows.length - 1).toBe(1);
    });
    // 過去問の募集投稿をする
    const postButton = screen.getByTestId("kakomon-post-modal");
    postButton.click();
    const titleInput = await screen.findByTestId("title-input");
    await userEvent.type(titleInput, "test");
    const nameInput = screen.getByTestId("name-input");
    await userEvent.type(nameInput, "テスト太郎");
    const descriptionInput = screen.getByTestId("description-input");
    await userEvent.type(descriptionInput, "これはテストです。");
    userEvent.click(screen.getByTestId("kakomon-post-button"));
    // 2回目のmockResolvedValueOnce
    await waitFor(() => {
      const recordList = screen.getByTestId("record-list");
      expect(recordList).toBeInTheDocument();
      const rows = recordList.querySelectorAll("tr");
      expect(rows.length - 1).toBe(2);
    });
  });

  // test("コメントを追加するとコメント一覧が更新される", async () => {
  //   // まずは過去問の募集投稿を取得
  //   await waitFor(() => {
  //     const recordList = screen.getByTestId("record-list");
  //     expect(recordList).toBeInTheDocument();
  //   });
  
  //   // 詳細モーダルを開く
  //   await waitFor(() => {
  //     const detailButtons = screen.getAllByTestId("detail-modal-button");
  //     fireEvent.click(detailButtons[0]);
  //   });
  
  //   // モーダルが開くのを待つ
  //   await waitFor(() => {
  //     expect(screen.getByTestId("detail-modal")).toBeInTheDocument();
  //   });
  
  //   // コメントを追加
  //   const nameInput = screen.getByPlaceholderText("お名前を入力してください。");
  //   const commentInput = screen.getByPlaceholderText("メッセージを入力してください。");
  //   fireEvent.change(nameInput, { target: { value: "テスト二郎" } });
  //   fireEvent.change(commentInput, { target: { value: "これはテストです(コメント版)。" } });
  //   fireEvent.click(screen.getByTestId("send-comment-button"));
  
  //   // コメントが追加されているか確認
  //   await waitFor(() => {
  //     expect(screen.getByText("これはテストです2(コメント版)。")).toBeInTheDocument();
  //   });
  // });
  
  
});
