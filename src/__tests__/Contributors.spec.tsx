import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Contributors } from "../components/Contributors";
import { act } from "react";
import userEvent from "@testing-library/user-event";

// firebase関数のモック化
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: { uid: "testUserId", email: "test@example.com" },
  }),
}));

const mockGetSubjects = jest
  .fn()
  .mockResolvedValue([{ id: 1, year: 1, name: "離散数学" }]);

// supabase関数のモック化
jest.mock("../lib/supabasefunctions", () => {
  return {
    getSubjects: () => mockGetSubjects(),
    getSubjectUserIds: jest.fn(),
    getUserInfo: jest.fn(),
    //     addUser: jest.fn(),
    //     updateUserInfo: jest.fn(),
    //     addUserToSubject: jest.fn()
  };
});

describe("過去問の募集投稿ページのテスト", () => {
  beforeEach(() => {
    render(
      <ChakraProvider>
        <Contributors />
      </ChakraProvider>
    );
  });

  test("タイトルが見れる", () => {
    expect(screen.getByTestId("kakomon-register-title")).toBeInTheDocument();
  });

  test("バリデーションエラーが表示される", async () => {
    const postButton = screen.getByTestId("kakomon-register-modal");

    await act(async () => {
      postButton.click();
    });

    const submitButton = await screen.findByTestId("kakomon-register-button");

    await act(async () => {
      submitButton.click();
    });

    expect(
      await screen.findByText("⚠️お名前は必須入力項目です。")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("⚠️カカオIDは必須入力項目です。")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("⚠️科目は必須入力項目です。")
    ).toBeInTheDocument();
  });

  test("過去問を登録できる", async () => {
    const postButton = screen.getByTestId("kakomon-register-modal");
    await act(async () => {
      postButton.click();
    });
    const submitButton = await screen.findByTestId("kakomon-register-button");
    expect(submitButton).toBeInTheDocument();

    const nameInput = await screen.findByTestId("name-input");
    await act(async () => {
      await userEvent.type(nameInput, "テスト太郎");
    });
    const kakaoIdInput = screen.getByTestId("kakaoId-input");
    await act(async () => {
      await userEvent.type(kakaoIdInput, "test-id");
    });

    const subjectNameInput = screen.getByTestId("subjectName-input");
    await act(async () => {
      await userEvent.type(subjectNameInput, "離散数学");
    });
    await act(async () => {
      submitButton.click();
    });

  });
    
});
