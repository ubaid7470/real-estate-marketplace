import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../redux/toast/toastSlice";
import {
  signInExecution,
  signInSuccess,
  signInFailed,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [inputValues, setInputValues] = useState({});
  const { isLoading } = useSelector((state) => state.user);
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
      const res = await fetch("/api/auth/signin", {
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
      dispatch(signInSuccess(data));
      navigate("/");
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
        Sign In
      </h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input
          className="rounded-lg p-3 focus:outline-secondary"
          type="email"
          name="email"
          placeholder="Email"
          id="email"
          onChange={inputHandler}
          required
        />
        <input
          className="rounded-lg p-3 focus:outline-secondary"
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          onChange={inputHandler}
          required
        />
        <button
          disabled={isLoading}
          type="submit"
          className="bg-secondary text-primary p-3 rounded-lg uppercase mt-3 hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2">
        <p>Don`t Have an account?</p>
        <Link to="/signup" className="text-secondary hover:opacity-90">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
