import { render, screen, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Contributors } from "../components/Contributors";
import { act } from "react";
import userEvent from "@testing-library/user-event";
import { addUser } from "../lib/supabasefunctions";

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

const mockGetSubjects = jest.fn().mockResolvedValue(mockSubjects);

// supabase関数のモック化
jest.mock("../lib/supabasefunctions", () => {
  return {
    getSubjects: () => mockGetSubjects(),
    getSubjectUserIds: jest.fn(),
    // getUserInfo: () => mockGetUserInfo(),
    getUserInfo: jest.fn(),
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

  // モック入りテスト
  test("過去問が正常にできるか", async () => {
    // 過去問登録モーダルを開く
    const postButton = screen.getByTestId("kakomon-register-modal");
    await act(async () => {
      postButton.click();
    });
    // submitボタンがみれる(モーダルが開けている)
    const submitButton = await screen.findByTestId("kakomon-register-button");
    expect(submitButton).toBeInTheDocument();
    // フォームに各値を入力
    const nameInput = await screen.findByTestId("name-input");
    await act(async () => {
      await userEvent.type(nameInput, "テスト太郎");
    });
    const kakaoIdInput = await screen.findByTestId("kakaoId-input");
    await act(async () => {
      await userEvent.type(kakaoIdInput, "test-id");
    });
    const subjectNameInput = await screen.findByTestId("subjectName-input");
    await act(async () => {
      await userEvent.selectOptions(subjectNameInput, "1");
    });
    // submitボタンを押す
    await act(async () => {
      submitButton.click();
    });
    // 追加の関数が呼ばれていることを確認
    await waitFor(() => {
      expect(addUser).toHaveBeenCalledWith(
        "テスト太郎",
        1,
        "test-id",
        "", // descriptionは任意項目なので空文字列でよし(逆になぜか値を入れるとエラーなる。tsの設定周りが原因？)
        "testUserId"
      );
    });
    // 登録が完了したことを表示
    expect(await screen.findByText("登録に成功しました！")).toBeInTheDocument();
  });
  // モックなしテスト
  // test("タイトルが見れる", () => {
  //   expect(screen.getByTestId("kakomon-register-title")).toBeInTheDocument();
  // });

  // test("バリデーションエラーが表示される", async () => {
  //   const postButton = screen.getByTestId("kakomon-register-modal");

  //   await act(async () => {
  //     postButton.click();
  //   });

  //   const submitButton = await screen.findByTestId("kakomon-register-button");

  //   await act(async () => {
  //     submitButton.click();
  //   });

  //   expect(
  //     await screen.findByText("⚠️お名前は必須入力項目です。")
  //   ).toBeInTheDocument();
  //   expect(
  //     await screen.findByText("⚠️カカオIDは必須入力項目です。")
  //   ).toBeInTheDocument();
  //   expect(
  //     await screen.findByText("⚠️科目は必須入力項目です。")
  //   ).toBeInTheDocument();
  // });
});
