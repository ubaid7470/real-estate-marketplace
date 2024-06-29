import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-primary">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
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
          <Link to="/">
            <li className="hidden sm:inline text-md font-medium text-dark  hover:underline cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-md font-medium text-dark hover:underline cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <li className="text-md font-medium text-dark hover:underline cursor-pointer">
                <img
                  className="rounded-full h-8 w-8 object-cover border-2 border-secondary"
                  src={currentUser.profileImage}
                  alt="profile image"
                />
              </li>
            ) : (
              <li className="text-md font-medium text-dark hover:underline cursor-pointer">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
