import { Link, useNavigate } from "react-router-dom";
import "./ProfileCard.css";
import { upload } from "../utils/config";
import { useDispatch, useSelector } from "react-redux";

import { deactivateAccount } from "../slices/userSlice";

const ProfileCard = ({ user, id = null }) => {

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { user: userDeactivate, message } = useSelector((state) => state.user)

  const handleDeactivate = async () => {

    if (window.confirm("Tem certeza? Esse processo não pode ser cancelado.")) {
      dispatch(deactivateAccount(userDeactivate))

      window.alert(message)

      navigate("/login")
    }
  }

  return (
    <>
      {user && user.followers && user.following && (
        <div id="profile-card">
          <div id="data">
            <h3>Perfil</h3>
            <div>
              {user.profileImage ? (
                <img
                  id="image"
                  src={`${upload}/users/${user.profileImage}`}
                  alt={user.name}
                />
              ) : (
                <p>Adicione uma foto de perfil</p>
              )}
            </div>
            <p>{user.name}</p>
            <div className="bio">
              {user.bio ? (
                <textarea value={user.bio} disabled></textarea>
              ) : (
                <textarea value="Adicione uma bio" disabled></textarea>
              )}
            </div>
            <div className="follow">
              <label>
                <p>
                  <Link to="/profile/following">
                    {user.following.length}
                    <br />
                    <span>seguindo</span>
                  </Link>
                </p>
              </label>
              <label>
                <p>
                  <Link to="/profile/followers">
                    {user.followers.length}
                    <br />
                    <span>seguidores</span>
                  </Link>
                </p>
              </label>
            </div>
            {id === user._id || id === null ? (
              <div className="buttons">
                <Link to="/profile">
                  <button className="prf-btn">Editar Perfil</button>
                </Link>
                <button className="prf-btn del" onClick={handleDeactivate}>Desativar Conta</button>
              </div>
            ) : (
              <button className="prf-btn">Seguir</button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;
