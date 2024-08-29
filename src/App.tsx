import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { CreatePost } from "./components/CreatePost";
import { Contributors } from "./components/Contributors";
import { Page404 } from "./components/Page404";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<CreatePost />} />
          <Route path="/contributors" element={<Contributors />} />
          <Route path="*" element={<Page404/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
