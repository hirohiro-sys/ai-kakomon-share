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

const mockSubjects = [{ id: 1, year: 1, name: "離散数学" }];
const mockUserInfos = [
  {
    id: 1,
    subjectId: 1,
    name: "John Doe",
    kakao_id: "john123",
    description: "Sample description",
    firebase_user_id: "testUserId",
  },
];
const mockAddUserInfo = [
  {
    id: 1,
    subjectId: 1,
    name: "John Doe",
    kakao_id: "john123",
    description: "Sample description",
    firebase_user_id: "testUserId",
  },
  {
    id: 2,
    subjectId: 1,
    name: "Jane Doe",
    kakao_id: "jane123",
    description: "Sample description",
    firebase_user_id: "testUserId",
  },
];

const mockGetSubjects = jest.fn().mockResolvedValue(mockSubjects);

const mockGetUserInfo = jest
  .fn()
  .mockResolvedValueOnce(mockUserInfos)
  .mockResolvedValue(mockAddUserInfo);

// supabase関数のモック化
jest.mock("../lib/supabasefunctions", () => {
  return {
    getSubjects: () => mockGetSubjects(),
    getSubjectUserIds: jest.fn(),
    getUserInfo: () => mockGetUserInfo(),
    addUser: jest.fn(),
    addUserToSubject: jest.fn(),
    //     updateUserInfo: jest.fn(),
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
    // const accordionButtons = await screen.findAllByTestId("accordion-button");
    // await act(async () => {
    //   accordionButtons[0].click();
    // });

    // await waitFor(() => {
    //   expect(screen.getByTestId("record-list")).toBeInTheDocument();
    // });

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
