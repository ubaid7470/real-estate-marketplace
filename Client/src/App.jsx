import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import Toast from "./components/UI/Toast";
import SimpleBackdrop from "./components/UI/BackDrop";
import UserListings from "./pages/UserListings";
import "./customCSS.css";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Toast />
      <SimpleBackdrop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/view-listings" element={<UserListings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
