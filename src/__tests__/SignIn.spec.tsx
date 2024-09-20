import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignIn } from "../components/SignIn"; // SignInコンポーネントのパスを指定
import { signInWithPopup, signOut } from "firebase/auth";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import SimpleSidebar from "../components/layout/MainLayout";

// signInWithPopupをモック化
jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(() => Promise.resolve()), // signOutもモック化
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("認証周りのテスト", () => {

  test("Googleでログインする際に関数が正常に実行されるか", async () => {
    const mockSignInWithPopup = signInWithPopup as jest.Mock;
    mockSignInWithPopup.mockResolvedValueOnce({ user: { uid: "123" } });
    render(
      <MemoryRouter>
        <ChakraProvider>
          <SignIn />
        </ChakraProvider>
      </MemoryRouter>
    );
    const googleButton = screen.getByRole("button", {
      name: /Googleでログイン/i,
    });
    fireEvent.click(googleButton);
    expect(mockSignInWithPopup).toHaveBeenCalled();
  });

  test("Githubでログインする際に関数が正常に実行されるか", async () => {
    const mockSignInWithPopup = signInWithPopup as jest.Mock;
    mockSignInWithPopup.mockResolvedValueOnce({ user: { uid: "123" } });
    render(
      <MemoryRouter>
        <ChakraProvider>
          <SignIn />
        </ChakraProvider>
      </MemoryRouter>
    );
    const githubButton = screen.getByRole("button", {
      name: /Githubでログイン/i,
    });
    fireEvent.click(githubButton);
    expect(mockSignInWithPopup).toHaveBeenCalled();
  });

  test("サインイン後にリダイレクトされるか", async () => {
    render(
      <MemoryRouter>
        <ChakraProvider>
          <SimpleSidebar />
        </ChakraProvider>
      </MemoryRouter>
    );
    
    const signOutButton = screen.getByTestId("signout-modal-button");
    fireEvent.click(signOutButton);
    
    await waitFor(() => {
      expect(screen.getByTestId("signout-button")).toBeInTheDocument();
    });
    
    const confirmButton = screen.getByTestId("signout-button");
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(signOut).toHaveBeenCalled(); // signOutが呼ばれたか確認
      expect(mockNavigate).toHaveBeenCalledWith("/signin"); // リダイレクト先の確認
    });
  });
});
