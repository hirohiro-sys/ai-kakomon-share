import { render, screen } from "@testing-library/react";
import { DetailApp } from "../components/DetailApp";
import { ChakraProvider } from "@chakra-ui/react";

describe("管理者ページ", () => {
  test("タイトルが表示されること", () => {
    render(
      <ChakraProvider>
        <DetailApp/>
      </ChakraProvider>
  )
  // console.log(screen.getByTestId("detail-page-title"))
    expect(screen.getByTestId("detail-page-title")).toBeInTheDocument()
  }

)});