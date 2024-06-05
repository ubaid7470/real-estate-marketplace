import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-medium	 uppercase my-6 text-orange-500">
        Sign Up
      </h1>
      <form className="flex flex-col gap-4">
        <input
          className="border-none rounded-lg p-3 focus:outline-orange-300"
          type="text"
          name="username"
          placeholder="Username"
          id="username"
          required
        />
        <input
          className="rounded-lg p-3 focus:outline-orange-300"
          type="text"
          name="email"
          placeholder="Email"
          id="email"
          required
        />
        <input
          className="rounded-lg p-3 focus:outline-orange-300"
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          required
        />
        <button className="bg-orange-500 text-white p-3 rounded-lg uppercase my-2 hover:opacity-90 disabled:opacity-50">
          Sign Up
        </button>
      </form>
      <div className="flex gap-2">
        <p>Have an account?</p>
        <Link to="/sign-in" className="text-orange-600 hover:opacity-90">
          Sign In
        </Link>
      </div>
    </div>
  );
}
