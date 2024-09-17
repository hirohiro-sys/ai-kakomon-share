import { render,screen} from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Contributors } from "../components/Contributors";


jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: { uid: "testUserId", email: "test@example.com" },
  }),
}));

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
    postButton.click();
    const submitButton = await screen.findByTestId("kakomon-register-button");
    submitButton.click();
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

});
