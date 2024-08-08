import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { openToast } from "../../redux/toast/toastSlice";

const ListingCard = ({ listingID, title, description, image, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await onDelete(listingID); // Call the delete function passed from parent
      handleClose(); // Close the menu after deletion
    } catch (error) {
      dispatch(
        openToast({
          message: "Failed to delete listing",
          severity: "error",
        })
      );
    }
  };

  return (
    <div className="relative flex w-full max-w-[24rem] cursor-pointer mb-6 flex-col rounded-xl bg-white bg-clip-border text-gray-700 duration-200 ease-in-out shadow-sm hover:shadow-lg">
      <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40">
        <img src={image} alt="ui/ux review check" />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-transparent to-black/60"></div>
        <button
          onClick={handleClick}
          className="!absolute top-4 right-4 h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase text-red-500 transition-all hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <HiDotsVertical fill="white" className="h-full w-5" />
            {/* <FaHeart fill="red" className="h-full w-5" /> */}
          </span>
        </button>
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
          <MenuItem onClick={handleClose}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>{" "}
          <MenuItem onClick={handleClose}>Close</MenuItem>
        </Menu>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h5 className="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-blue-gray-900">
            {title}
          </h5>
          <p className="flex items-center gap-1.5 font-sans text-base font-normal leading-relaxed text-blue-gray-900 antialiased">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="-mt-0.5 h-5 w-5 text-yellow-700"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
            5.0
          </p>
        </div>
        <p className="block font-sans text-base antialiased font-light leading-relaxed text-gray-700">
          {description}
        </p>
        <div className="inline-flex flex-wrap items-center gap-3 mt-8 group"></div>
      </div>
    </div>
  );
};

ListingCard.propTypes = {
  listingID: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ListingCard;
