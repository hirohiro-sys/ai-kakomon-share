import { render, screen } from "@testing-library/react";
import { DetailApp } from "../components/DetailApp";
import { ChakraProvider } from "@chakra-ui/react";

// 管理者ページは特に機能がないため、タイトルのみ表示されることのみ確認する
describe("管理者ページ", () => {
  test("タイトルが表示されること", () => {
    render(
      <ChakraProvider>
        <DetailApp/>
      </ChakraProvider>
  )
    expect(screen.getByTestId("admin-page-title")).toBeInTheDocument()
  }
)});