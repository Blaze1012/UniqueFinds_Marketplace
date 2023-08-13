import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home/index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedPage from "./components/ProtectedPage";
import Spinner from "./components/Spinner";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ProductInfo from "./pages/ProductInfo";

function App() {
  const { loading } = useSelector((state) => state.loaders);
  return (
    <div>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedPage>
                <Home />
              </ProtectedPage>
            }
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <Profile />
              </ProtectedPage>
            }
          ></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route></Route>

          <Route
            path="/admin"
            element={
              <ProtectedPage>
                <Admin />
              </ProtectedPage>
            }
          ></Route>

          <Route
            path="/product/:id"
            element={
              <ProtectedPage>
                <ProductInfo />
              </ProtectedPage>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
