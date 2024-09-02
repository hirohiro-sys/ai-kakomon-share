import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { CreatePost } from "./components/CreatePost";
import { Contributors } from "./components/Contributors";
import { Page404 } from "./components/Page404";
import { DetailApp } from "./components/DetailApp";
import Layout from "./components/layout/CommonLayout";
import { SignIn } from "./components/SignIn";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <CreatePost />
              </Layout>
            }
          />
          <Route
            path="/contributors"
            element={
              <Layout>
                <Contributors />
              </Layout>
            }
          />
          <Route
            path="/detail-app"
            element={
              <Layout>
                <DetailApp />
              </Layout>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
