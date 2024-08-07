// import Breadcrumb from "../components/UI/Breadcrumbs";
import { useEffect, useState } from "react";
import ListingCard from "../components/UI/ListingCard";
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../redux/toast/toastSlice";

const UserListings = () => {
  const [userListings, setUserListings] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchUserListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(
          openToast({
            message: data.message,
            severity: "error",
          })
        );
        return;
      }
      setUserListings(data);
      console.log(userListings);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, []);

  return (
    <div className="custom-container">
      <h1 className="primary-heading">Your Listings</h1>
      <div className="flex justify-center gap-x-5 md:gap-x-12 flex-wrap">
        {userListings.map((listing) => (
          <ListingCard
            key={listing._id}
            image={listing.imageUrls[0]}
            title={listing.title}
            description={listing.description}
          />
        ))}
      </div>
    </div>
  );
};

export default UserListings;
