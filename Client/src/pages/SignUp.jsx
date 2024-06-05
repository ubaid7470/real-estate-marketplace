import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [inputValues, setInputValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.id]: e.target.value,
    });
    console.log(inputValues);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputValues),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setIsLoading(false);
        setError(data.message);
        return;
      }
      setError(null);
      setIsLoading(false);
      navigate("/signin");
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-medium	 uppercase my-6 text-orange-500">
        Sign Up
      </h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input
          className="border-none rounded-lg p-3 focus:outline-orange-300"
          type="text"
          name="username"
          placeholder="Username"
          id="username"
          onChange={inputHandler}
        />
        <input
          className="rounded-lg p-3 focus:outline-orange-300"
          type="text"
          name="email"
          placeholder="Email"
          id="email"
          onChange={inputHandler}
        />
        <input
          className="rounded-lg p-3 focus:outline-orange-300"
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          onChange={inputHandler}
        />
        <button
          disabled={isLoading}
          type="submit"
          className="bg-orange-500 text-white p-3 rounded-lg uppercase my-2 hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2">
        <p>Have an account?</p>
        <Link to="/sign-in" className="text-orange-600 hover:opacity-90">
          Sign In
        </Link>
      </div>
      {error && (
        <div className="bg-red-300 mt-3 rounded-lg p-3">
          <p className="text-red-600 text-sm "> {error}</p>
        </div>
      )}
    </div>
  );
}
