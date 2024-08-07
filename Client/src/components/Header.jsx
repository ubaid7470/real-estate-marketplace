import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/logo.png";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import {
  signOutUserExecute,
  signOutUserSuccess,
  signOutUserFailed,
} from "../redux/user/userSlice";
import { useState } from "react";

export default function Header() {
  const { currentUser, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      dispatch(signOutUserExecute());
      const res = await fetch("api/auth/signOut");

      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailed(error.message));
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailed(error.message));
    }
  };

  return (
    <header className="bg-primary custom-container">
      <div className="flex justify-between items-center">
        <Link to="/">
          <img className="h-16 w-22 md:h-20 md:w-32" src={logo} alt="Logo" />
        </Link>
        <form className="bg-transparent border-b-2 border-secondary border-opacity-40 text-md text-dark px-3 py-2 flex items-center">
          <input
            type="text"
            placeholder="Find House, Apartments, Hut..."
            className="bg-transparent focus:outline-none w-36 sm:w-64 pe-2"
          />
          <FaSearch className="text-secondary cursor-pointer" />
        </form>
        <ul className="flex items-center sm:gap-5">
          <li className="hidden sm:inline text-md font-medium text-dark hover:underline cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <li className="hidden sm:inline text-md font-medium text-dark hover:underline cursor-pointer">
            <Link to="/about">About</Link>
          </li>

          {currentUser ? (
            <>
              <li
                className="text-md font-medium text-dark hover:underline cursor-pointer"
                id="demo-positioned-button"
                aria-controls={open ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <img
                  className="rounded-full h-8 w-8 object-cover border-2 border-secondary"
                  src={currentUser.profileImage}
                  alt="profile image"
                />
              </li>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Link to="/profile" className="text-dark cursor-pointer">
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                </Link>
                <Link to="/view-listings" className="text-dark cursor-pointer">
                  <MenuItem onClick={handleClose}>View Listings</MenuItem>
                </Link>
                <Link to="/create-listing" className="text-dark cursor-pointer">
                  <MenuItem onClick={handleClose}>Create Listing</MenuItem>
                </Link>
                <a href="" onClick={handleSignOut} className="text-red-700">
                  <MenuItem onClick={handleClose}>Logout</MenuItem>
                </a>
              </Menu>
            </>
          ) : (
            <li className="text-md font-medium text-dark hover:underline cursor-pointer">
              <Link to="/signin">Sign in</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
