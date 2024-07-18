import { TailSpin } from "react-loader-spinner";
import { BsTrash3Fill } from "react-icons/bs";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { closeToast, openToast } from "../redux/toast/toastSlice";
import { handleLoader } from "../redux/user/userSlice";
import CustomSwitch from "../components/CustomSwitch";
import { closeBackdrop, openBackdrop } from "../redux/Loaders/backdropSlice";

export default function CreateListing() {
  const dispatch = useDispatch();
  const { isLoading, currentUser } = useSelector((state) => state.user);
  const [imageFiles, setImageFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    regularPrice: "",
    discountPrice: "",
    type: "rent",
    furnished: false,
    parking: false,
    discount: false,
    petsAllowed: false,
    bedroom: 1,
    bathroom: 1,
    kitchen: 1,
    balcony: 0,
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const handleImageSubmit = () => {
    if (
      imageFiles.length > 0 &&
      imageFiles.length + formData.imageUrls.length < 9
    ) {
      dispatch(closeToast());
      setImageUploadLoading(true);
      setImageUploadError(false);
      const promises = [];
      let sizeError = false;
      for (let i = 0; i < imageFiles.length; i++) {
        if (imageFiles[i].size > 2 * 1024 * 1024) {
          sizeError = true;
          setImageUploadLoading(false);
          break;
        }
        promises.push(storeImage(imageFiles[i]));
      }

      if (sizeError) {
        setImageUploadError("Each image must be less than 2MB");
        dispatch(
          openToast({
            message: "Each image must be less than 2MB",
            severity: "error",
          })
        );
        return;
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadLoading(false);
          dispatch(
            openToast({
              message: "Images have been uploaded",
              severity: "success",
            })
          );
        })
        .catch((error) => {
          console.error(error);
          setImageUploadLoading(false);
          setImageUploadError("Image upload failed");
          dispatch(
            openToast({
              message: "Image upload failed",
              severity: "error",
            })
          );
        });
    } else {
      setImageUploadError(
        "Please upload at least 1 image and no more than 8 images!"
      );
      dispatch(
        openToast({
          message: "Please upload at least 1 image and no more than 8 images!",
          severity: "error",
        })
      );
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const deleteImageFromFirebase = async (imageUrl) => {
    const storage = getStorage(app);
    const imageRef = ref(storage, imageUrl);

    try {
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image from Firebase storage", error);
    }
  };

  const handleDeleteImage = async (index) => {
    const imageUrl = formData.imageUrls[index];
    await deleteImageFromFirebase(imageUrl);
    setFormData((prevFormData) => ({
      ...prevFormData,
      imageUrls: prevFormData.imageUrls.filter((url, i) => i !== index),
    }));
  };

  const onChangeHandler = (event) => {
    if (event.target.id == "sell" || event.target.id == "rent") {
      setFormData({
        ...formData,
        type: event.target.id,
      });
    }
    if (
      event.target.type == "text" ||
      event.target.type == "number" ||
      event.target.type == "textarea"
    ) {
      setFormData({
        ...formData,
        [event.target.id]: event.target.value,
      });
    }

    if (
      event.target.id === "parking" ||
      event.target.id === "petsAllowed" ||
      event.target.id === "furnished" ||
      event.target.id === "discount"
    ) {
      setFormData({
        ...formData,
        [event.target.id]: event.target.checked,
      });
    }
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return dispatch(
          openToast({
            message: "Upload Property Images!",
            severity: "error",
          })
        );
      } else if (+formData.regularPrice <= +formData.discountPrice) {
        return dispatch(
          openToast({
            message: "Discounted Price must be lower than Regular Price!",
            severity: "error",
          })
        );
      }

      if (formData.discountPrice == "") {
        formData.discountPrice = 0;
      }

      dispatch(openBackdrop());
      const res = await fetch("api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();

      dispatch(closeBackdrop());
      if (data.success === false) {
        dispatch(
          openToast({
            message: data.message,
            severity: "error",
          })
        );
      }
    } catch (error) {
      dispatch(closeBackdrop());
      dispatch(
        openToast({
          message: error.message,
          severity: "error",
        })
      );
    }
  };

  useEffect(() => {
    dispatch(closeBackdrop());
    setImageUploadError(false);
    dispatch(closeToast());
  }, []);

  return (
    <main className="mx-auto p-3 max-w-5xl">
      <h1 className="text-3xl font-bold uppercase my-6">About Your Place</h1>
      <form
        onSubmit={formSubmitHandler}
        className="flex flex-col sm:flex-row gap-8"
      >
        <div className="flex flex-col gap-3 flex-1">
          <h2 className="text-lg font-medium">Property Details</h2>
          <input
            className="shadow-sm rounded-lg p-3 mt-1 focus:outline-secondary"
            id="title"
            value={formData.title}
            onChange={onChangeHandler}
            type="text"
            placeholder="Enter Title"
            maxLength={64}
            minLength={10}
            required
          />
          <textarea
            className="shadow-sm rounded-lg p-3 focus:outline-secondary"
            id="description"
            value={formData.description}
            onChange={onChangeHandler}
            type="text"
            placeholder="Enter Description"
            required
          />
          <input
            className="shadow-sm rounded-lg p-3 focus:outline-secondary"
            id="address"
            value={formData.address}
            onChange={onChangeHandler}
            type="text"
            placeholder="Enter Address"
            required
          />

          <h3 className="text-lg font-medium mt-4">Property Type</h3>
          <div className="flex gap-x-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Checkbox
                id="sell"
                checked={formData.type === "sell"}
                onChange={onChangeHandler}
                className="w-4"
                sx={{
                  color: "#AF795D",
                  "&.Mui-checked": {
                    color: "#AF795D",
                  },
                }}
              />
              <label htmlFor="sell" className="text-md">
                Sell
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="rent"
                checked={formData.type === "rent"}
                onChange={onChangeHandler}
                className="w-4"
                sx={{
                  color: "#AF795D",
                  "&.Mui-checked": {
                    color: "#AF795D",
                  },
                }}
              />
              <label htmlFor="rent" className="text-md">
                Rent
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="furnished"
                checked={formData.furnished}
                onChange={onChangeHandler}
                className="w-4"
                sx={{
                  color: "#AF795D",
                  "&.Mui-checked": {
                    color: "#AF795D",
                  },
                }}
              />
              <label htmlFor="furnished" className="text-md">
                Furnished
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="parking"
                checked={formData.parking}
                onChange={onChangeHandler}
                className="w-4"
                sx={{
                  color: "#AF795D",
                  "&.Mui-checked": {
                    color: "#AF795D",
                  },
                }}
              />
              <label htmlFor="parking" className="text-md">
                Parking Area
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="petsAllowed"
                checked={formData.petsAllowed}
                onChange={onChangeHandler}
                className="w-4"
                sx={{
                  color: "#AF795D",
                  "&.Mui-checked": {
                    color: "#AF795D",
                  },
                }}
              />
              <label htmlFor="petsAllowed" className="text-md">
                Pets Allowed
              </label>
            </div>
          </div>

          <h3 className="text-lg font-medium mt-3">Property Rooms</h3>
          <div className="flex flex-wrap gap-6 mb-3 mt-2">
            <div className="flex items-center gap-2">
              <label>Bedrooms</label>
              <input
                type="number"
                id="bedroom"
                onChange={onChangeHandler}
                value={formData.bedroom}
                min="1"
                max="10"
                required
                className="no-spinner p-1 text-center border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <label>Bathrooms</label>
              <input
                type="number"
                id="bathroom"
                onChange={onChangeHandler}
                value={formData.bathroom}
                min="1"
                max="10"
                required
                className="no-spinner p-1 text-center border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <label>Kitchens</label>
              <input
                type="number"
                id="kitchen"
                onChange={onChangeHandler}
                value={formData.kitchen}
                min="1"
                max="10"
                required
                className="no-spinner p-1 text-center border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <label>Balconies</label>
              <input
                type="number"
                id="balcony"
                onChange={onChangeHandler}
                value={formData.balcony}
                min="0"
                max="10"
                required
                className="no-spinner p-1 text-center border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <h2 className="text-lg font-medium">Property Images</h2>
          <div className="flex gap-4">
            <input
              onChange={(e) => setImageFiles(e.target.files)}
              type="file"
              multiple
              id="images"
              accept="image/*"
              className="block border border-secondary p-2 rounded w-full cursor-pointer text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-medium file:cursor-pointer
      file:bg-secondaryLight file:text-white
      hover:file:bg-secondary"
            />

            <button
              onClick={handleImageSubmit}
              disabled={imageUploadLoading}
              type="button"
              className="p-3 text-secondary border border-secondary rounded uppercase hover:shadow-lg  disabled:opacity-80"
            >
              {imageUploadLoading ? (
                <TailSpin
                  visible={true}
                  height="25"
                  width="61"
                  color="#AF795D"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                />
              ) : (
                "Upload"
              )}
            </button>
          </div>
          <span className="font-normal text-sm text-gray-600 ml-2">
            *The first image will be the cover (max 8)
          </span>

          {imageUploadLoading && (
            <div className="flex flex-wrap gap-y-5 gap-x-6 border border-dashed border-secondaryLight shadow rounded-md p-3">
              {formData.imageUrls.length + imageFiles.length > 0 && (
                <>
                  {[
                    ...Array(imageFiles.length + formData.imageUrls.length),
                  ].map((_, index) => (
                    <div key={index} className="animate-pulse flex space-x-4">
                      <div className="rounded-lg bg-secondaryLight w-24 h-24"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {!imageUploadLoading && formData.imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-y-5 gap-x-6 border border-dashed border-secondaryLight shadow rounded-md p-3">
              {formData.imageUrls.map((image, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <img
                    src={image}
                    alt="image"
                    className="w-full h-full object-cover rounded-lg shadow-secondaryLight shadow-md"
                  />
                  {hoveredIndex === index && (
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-0 h-full w-full flex items-center justify-center text-white rounded hover:bg-dark hover:opacity-60"
                    >
                      <BsTrash3Fill size={25} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <h3 className="text-lg font-medium mt-3">Property Pricing</h3>
          <div className="flex justify-between items-center gap-2">
            <div className="flex flex-col items-center w-3.5/12">
              <label>Regular price</label>
              <span className="text-xs">($ / month)</span>
            </div>
            <input
              type="number"
              id="regularPrice"
              onChange={onChangeHandler}
              value={formData.regularPrice}
              min="1"
              placeholder="Enter Regular Price"
              required
              className="no-spinner text-center border border-gray-300 w-7/12 rounded-lg p-2 focus:outline-secondary"
            />
          </div>
          <div className="flex items-center">
            <label className="font-medium">Discount: </label>
            <CustomSwitch
              aria-label={"discount switch"}
              id="discount"
              checked={formData.discount}
              onChange={onChangeHandler}
            />
          </div>
          {formData.discount && (
            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-col items-center w-3.5/12">
                <label>Discounted price</label>
                <span className="text-xs">($ / month)</span>
              </div>
              <input
                type="number"
                id="discountPrice"
                onChange={onChangeHandler}
                value={formData.discountPrice}
                min="1"
                placeholder="Enter Discounted Price"
                className="no-spinner text-center border border-gray-300 w-7/12 rounded-lg p-2 focus:outline-secondary"
              />
            </div>
          )}
          <button className="p-3 my-4 sm:my-12 bg-secondary text-primary rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
