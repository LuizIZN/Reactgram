import "./EditProfile.css";

import { upload } from "../../utils/config";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { profile, resetMessage, updateProfile } from "../../slices/userSlice";

import Message from "../../components/Message";
import ProfileCard from "../../components/ProfileCard";

const EditProfile = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [imagePreview, setImagePreview] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const { user, loading, error, message } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);

  const handleFile = (e) => {
    const image = e.target.files[0];

    setImagePreview(image);

    setProfileImage(image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
    };

    if (profileImage) {
      userData.profileImage = profileImage;
    }

    if (bio) {
      userData.bio = bio;
    }

    if (newPassword && password) {
      userData.password = password;
      userData.newPassword = newPassword;
    }

    const formData = new FormData();

    const userFormData = Object.keys(userData).forEach((key) =>
      formData.append(key, userData[key])
    );

    formData.append("user", userFormData);

    await dispatch(updateProfile(formData));

    setTimeout(() => {
      dispatch(resetMessage());
      dispatch(profile())
    }, 2000);

  };

  return (
    <div id="profile-edit">
      <ProfileCard user={user} />
      <div id="edit-profile">
        <h2>Edite seu perfil</h2>
        <p className="subtitle">Adicione uma imagem e conte mais sobre você</p>
        {/* preview da imagem */}
        {(imagePreview || user.profileImage) && (
          <img
            src={
              imagePreview
                ? URL.createObjectURL(imagePreview)
                : `${upload}/users/${user.profileImage}`
            }
            alt={user.name}
            className="profile-image"
          />
        )}
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
        <br />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            onChange={(e) => setName(e.target.value)}
            value={name || ""}
          />
          <input
            type="email"
            placeholder="Email"
            value={email || ""}
            disabled
          />
          <label>
            <span>Imagem do perfil:</span>
            <input type="file" onChange={handleFile} />
          </label>
          <label>
            <span>Fale mais sobre você:</span>
            <input
              type="text"
              placeholder="Bio"
              onChange={(e) => setBio(e.target.value)}
              value={bio || ""}
            />
          </label>
          <label>
            <span>Quer alterar sua senha?</span>
            <input
              type="password"
              placeholder="Digite sua senha atual"
              onChange={(e) => setPassword(e.target.value)}
              value={password || ""}
            />
            <input
              type="password"
              placeholder="Digite sua nova senha"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword || ""}
            />
          </label>
          {!loading && <input type="submit" value="Atualizar" />}
          {loading && <input type="submit" value="Aguarde..." disabled />}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
