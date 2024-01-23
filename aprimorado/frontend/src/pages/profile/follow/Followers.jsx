import ProfileCard from "../../../components/ProfileCard";
import "./Follow.css";

const Followers = ({ user }) => {

  return (
    <div className="follow-page">
      <ProfileCard user={user} />
      <div className="follow-card">
        <h3>Seguidores</h3>
        {user && user.followers && (
          <div className="card">
            {user.followers.map((f) => {
              return f;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Followers;
