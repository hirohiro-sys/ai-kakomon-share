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

const mockGetKakomonPosts = jest
  .fn()
  .mockResolvedValueOnce(initialMockData)
  .mockResolvedValueOnce(initialMockData)
  .mockResolvedValueOnce(initialMockData)
  .mockResolvedValue(addMockData);


// パスのモジュールを全てモック化
jest.mock("../lib/supabasefunctions", () => {
  return {
    getKakomonPosts: () => mockGetKakomonPosts(),
    // 全てモック化した場合はデフォルトでjest.fn()を返すらしいが明示的に指定することで可読性が上がる
    addKakomonPost: jest.fn(),
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
});