import googleIcon from "../assets/google-icon.png";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { signInExecution, signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.user);

  const googleAuthHandler = async () => {
    try {
      dispatch(signInExecution());
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const googleCredData = await signInWithPopup(auth, provider);

      const res = await fetch("api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: googleCredData.user.displayName,
          email: googleCredData.user.email,
          image: googleCredData.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("google: ", error);
    }
  };
  return (
    <button
      onClick={googleAuthHandler}
      type="button"
      disabled={isLoading}
      className="flex gap-5 items-center justify-center p-2 text-center bg-dark mb-3 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-50"
    >
      <img src={googleIcon} alt="google-icon" height={30} width={30} />
      {isLoading ? "Loading..." : "Continue with Google"}
    </button>
  );
}
