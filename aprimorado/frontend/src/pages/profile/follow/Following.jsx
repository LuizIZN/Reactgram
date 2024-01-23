import ProfileCard from "../../../components/ProfileCard";
import "./Follow.css";

const Following = ({ user }) => {
  return (
    <div className="follow-page">
      <ProfileCard user={user} />
      <div className="follow-card">
        <h3>Seguindo</h3>
        {user && user.following && (
          <p>
            {user.following.map((f) => {
              return f;
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default Following;
