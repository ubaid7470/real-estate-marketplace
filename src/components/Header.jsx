import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-orange-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-xl sm:text-2xl flex flex-wrap">
            <span className="text-orange-400">Real</span>
            <span className="text-orange-500">Estate</span>
          </h1>
        </Link>
        <form className="bg-orange-100 text-black px-3 py-2 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-32 sm:w-48"
          />
          <FaSearch className="text-orange-400" />
        </form>
        <ul className="flex gap-5">
          <Link to="/">
            <li className="hidden sm:inline text-md sm:text-lg text-orange-900 font-semibold hover:underline cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-md sm:text-lg text-orange-900 font-semibold hover:underline cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/sign-in">
            <li className="text-md sm:text-lg text-orange-900 font-semibold hover:underline cursor-pointer">
              Sign in
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
