import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../redux/toast/toastSlice";
import {
  signInExecution,
  signUpSuccess,
  signInFailed,
} from "../redux/user/userSlice";

export default function SignUp() {
  const [inputValues, setInputValues] = useState({});
  const { isLoading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const inputHandler = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.id]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInExecution());
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputValues),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailed(data.message));
        dispatch(
          openToast({
            message: data.message,
            severity: "error",
          })
        );
        return;
      }
      dispatch(signUpSuccess());
      navigate("/signin");
    } catch (error) {
      dispatch(signInFailed(error.message));
      dispatch(
        openToast({
          message: error.message,
          severity: "error",
        })
      );
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-medium	 uppercase my-6 text-dark">
        Sign Up
      </h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input
          className="shadow-sm rounded-lg p-3 focus:outline-secondary"
          type="text"
          name="username"
          placeholder="Username"
          id="username"
          onChange={inputHandler}
        />
        <input
          className="rounded-lg p-3 shadow-sm focus:outline-secondary"
          type="email"
          name="email"
          placeholder="Email"
          id="email"
          onChange={inputHandler}
        />
        <input
          className="rounded-lg p-3 shadow-sm focus:outline-secondary"
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          onChange={inputHandler}
        />
        <button
          disabled={isLoading}
          type="submit"
          className="bg-secondary text-primary p-3 mt-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2">
        <p>Have an account?</p>
        <Link to="/signin" className="text-secondary hover:opacity-95">
          Sign In
        </Link>
      </div>
    </div>
  );
}
