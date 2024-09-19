import {  render, screen, waitFor } from "@testing-library/react";
import { CreatePost } from "../components/CreatePost";
import { ChakraProvider } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";

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
//     title: "test",
//     name: "テスト太郎",
//     comment: "これはテストです(コメント版)。",
//     created_at: "2021-10-01T00:00:00.000Z",
//   },
// ];
// const addMockDataComment = [
//   {
//     id: 1,
//     title: "test",
//     name: "テスト太郎",
//     comment: "これはテストです(コメント版)。",
//     created_at: "2021-10-01T00:00:00.000Z",
//   },
//   {
//     id: 2,
//     title: "test",
//     name: "テスト二郎",
//     comment: "これはテストです2(コメント版)。",
//     created_at: "2021-10-01T00:00:00.000Z",
//   },
// ];

const mockGetKakomonPosts = jest
  .fn()
  .mockResolvedValueOnce(initialMockData)
  .mockResolvedValueOnce(initialMockData)
  .mockResolvedValueOnce(initialMockData)
  .mockResolvedValue(addMockData);

// const mockGetKakomonPostComments = jest
//   .fn()
//   .mockResolvedValueOnce(initialMockDataComment)
//   .mockResolvedValue(addMockDataComment);

jest.mock("../lib/supabasefunctions", () => {
  return {
    getKakomonPosts: () => mockGetKakomonPosts(),
    addKakomonPost: jest.fn(),
    // getKakomonPostComments: () => mockGetKakomonPostComments(),
    // addKakomonPostComment: jest.fn(),
  };
});

describe("過去問の募集投稿ページのテスト", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <ChakraProvider>
          <CreatePost />
        </ChakraProvider>
      );
    });
  });

  
  test("タイトルが見れる", () => {
    expect(screen.getByTestId("kakomon-post-title")).toBeInTheDocument();
  });

  test("フォームのバリデーションが機能する", async () => {
    const postButton = screen.getByTestId("kakomon-post-modal");
    
    await act(async () => {
      postButton.click();
    });

    const submitButton = await screen.findByTestId("kakomon-post-button");
    
    await act(async () => {
      submitButton.click();
    });

    expect(await screen.findByText("⚠️タイトルは必須入力項目です。")).toBeInTheDocument();
    expect(await screen.findByText("⚠️お名前は必須入力項目です。")).toBeInTheDocument();
    expect(await screen.findByText("⚠️過去問詳細は必須入力項目です。")).toBeInTheDocument();
  });

  test("過去問の募集投稿をするとレコードが1つ増える", async () => {
    await waitFor(() => {
      const recordList = screen.getByTestId("record-list");
      expect(recordList).toBeInTheDocument();
      const rows = recordList.querySelectorAll("tr");
      expect(rows.length - 1).toBe(1);
    });

    const postButton = screen.getByTestId("kakomon-post-modal");
    
    await act(async () => {
      postButton.click();
    });

    const titleInput = await screen.findByTestId("title-input");
    await act(async () => {
      await userEvent.type(titleInput, "test");
    });

    const nameInput = screen.getByTestId("name-input");
    await act(async () => {
      await userEvent.type(nameInput, "テスト太郎");
    });

    const descriptionInput = screen.getByTestId("description-input");
    await act(async () => {
      await userEvent.type(descriptionInput, "これはテストです。");
    });

    await act(async () => {
      userEvent.click(screen.getByTestId("kakomon-post-button"));
    });

    await waitFor(() => {
      const recordList = screen.getByTestId("record-list");
      expect(recordList).toBeInTheDocument();
      const rows = recordList.querySelectorAll("tr");
      expect(rows.length - 1).toBe(2);
    });
  });
  // test("コメントを追加するとコメント一覧が更新される", async () => {
  //   await waitFor(() => {
  //     const recordList = screen.getByTestId("record-list");
  //     expect(recordList).toBeInTheDocument();
  //   });

  //   const detailButton = screen.getAllByTestId("detail-modal-button")[0];
  //   await act(async () => {
  //     detailButton.click();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByTestId("detail-modal")).toBeInTheDocument();
  //   });
  // });
});