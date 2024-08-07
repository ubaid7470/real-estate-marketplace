import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaCamera } from "react-icons/fa";
import { app } from "../firebase";
import { openToast } from "../redux/toast/toastSlice";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import {
  updateUserExecute,
  updateUserFailed,
  updateUserSuccess,
  deleteUserExecute,
  deleteUserSuccess,
  deleteUserFailed,
  signOutUserExecute,
  signOutUserSuccess,
  signOutUserFailed,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, isLoading, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(undefined);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(undefined);
  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();

  const profileRef = useRef(null);
  const inputHandler = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (imageFile) handleProfileUpload(imageFile);
  }, [imageFile]);

  useEffect(() => {
    if (imageUploadProgress === 100) {
      if (fileUploadError) {
        dispatch(
          openToast({
            message: "Image must be less than 2MB",
            severity: "error",
          })
        );
      } else {
        dispatch(
          openToast({
            message: "Profile Image Uploaded!",
            severity: "success",
          })
        );
      }
    }
  }, [imageUploadProgress, fileUploadError, dispatch]);

  //Firebase profile image upload
  const handleProfileUpload = (imageFile) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "ProfileImage";
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(Math.round(uploadProgress));
      },
      (error) => {
        setFileUploadError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profileImage: downloadURL });
        });
      }
    );
  };

  const handleProfileDeletion = async (e) => {
    e.preventDefault();
    try {
      dispatch(deleteUserExecute());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.success === false) {
        dispatch(deleteUserFailed(error.message));
        dispatch(
          openToast({
            message: error.message,
            severity: "error",
          })
        );
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailed(error.message));
      dispatch(
        openToast({
          message: error.message,
          severity: "error",
        })
      );
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      dispatch(signOutUserExecute());
      const res = await fetch("api/auth/signOut");

      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailed(error.message));
        dispatch(
          openToast({
            message: error.message,
            severity: "error",
          })
        );
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailed(error.message));
      dispatch(
        openToast({
          message: error.message,
          severity: "error",
        })
      );
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setFileUploadError(false);
      dispatch(updateUserExecute());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailed(data.message));
        dispatch(
          openToast({
            message: data.message,
            severity: "error",
          })
        );
        return;
      }
      dispatch(updateUserSuccess(data));
      dispatch(
        openToast({
          message: "Your profile has been updated!",
          severity: "success",
        })
      );
    } catch (error) {
      dispatch(updateUserFailed(error.message));
      dispatch(
        openToast({
          message: error.message,
          severity: "error",
        })
      );
    }
  };

  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="text-3xl text-center font-bold uppercase my-6 cursor-pointer">
        My Profile
      </h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setImageFile(e.target.files[0])}
          type="file"
          accept="image/*"
          ref={profileRef}
          hidden
        />
        <div className="cursor-pointer relative self-center">
          <img
            className="rounded-full h-28 w-28 object-cover self-center border-2 border-secondary transition-opacity duration-300 ease-in-out hover:opacity-50"
            src={formData.profileImage || currentUser.profileImage}
            alt="Profile Image"
          />
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-dark bg-opacity-30 rounded-full"
            onClick={() => profileRef.current.click()}
          >
            <FaCamera className="text-light h-8 w-8" />
          </div>
        </div>

        <p className="text-center">
          {imageUploadProgress >= 1 && imageUploadProgress < 100 ? (
            <span className="text-secondary">
              Uploading profile image {imageUploadProgress}%
            </span>
          ) : (
            <span hidden />
          )}
        </p>
        <input
          className="shadow-sm rounded-lg p-3 focus:outline-secondary"
          type="text"
          name="username"
          placeholder="Username"
          id="username"
          defaultValue={currentUser.username}
          onChange={inputHandler}
        />
        <input
          className="rounded-lg p-3 shadow-sm focus:outline-secondary"
          type="email"
          name="email"
          placeholder="Email"
          id="email"
          defaultValue={currentUser.email}
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
          type="submit"
          disabled={isLoading}
          className="bg-secondary text-primary mt-3 rounded-lg text-center p-3.5 hover:opacity-95 disabled:opacity-60"
        >
          {isLoading ? "Loading..." : "Update Profile"}
        </button>

        <div className="flex justify-between w-full">
          <Link to="/create-listing" className="w-1/2 p-1">
            <button className="bg-primary w-full outline outline-2 outline-dark hover:bg-dark hover:text-primary text-dark rounded-lg text-center p-3 transition duration-200 ease-in">
              Create Listing
            </button>
          </Link>

          <Link to="/view-listings" className="w-1/2 p-1">
            <button className="bg-dark outline outline-2 outline-dark hover:outline-2 hover:outline-dark hover:bg-primary hover:text-dark text-primary w-full rounded-lg text-center p-3 transition duration-300 ease-in">
              View Listings
            </button>
          </Link>
        </div>
      </form>
      <div className="flex flex-row justify-between px-2 mt-4 mb-8">
        <a
          onClick={handleProfileDeletion}
          className="text-red-500 font-medium cursor-pointer"
        >
          Delete Account
        </a>
        <a
          onClick={handleSignOut}
          className="text-dark font-medium cursor-pointer"
          href=""
        >
          Sign Out
        </a>
      </div>
      <p className="text-red-600">{error ? error : ""}</p>
    </div>
  );
}
