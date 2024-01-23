import { useParams } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard";
import "./Profile.css";
import { useSelector } from "react-redux";

const Profile = () => {
  const { id } = useParams();

  const { user } = useSelector((state) => state.user)

  return (
    <div id="profile">
      <ProfileCard user={user} id={id} />

      <div id="photos">
        <h3>Fotos</h3>
      </div>
    </div>
  );
};

export default Profile;
