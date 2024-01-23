const User = require("../models/User.js");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const mongoose = require("mongoose");

// generate user token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

const generateHash = async (password) => {
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

// registe ruser and sign in
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // check if user exists
  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({
      errors: ["O e-mail já está cadastrado! Por favor, use outro e-mail."],
    });
    return;
  }

  // create user
  const newUser = await User.create({
    name,
    email,
    password: (await generateHash(password)).valueOf(),
    flag: true,
  });

  // if user was created successfully, return the token
  if (!newUser) {
    res.status(422).json({
      errors: ["Houve um erro, por favor, tente novamente mais tarde!"],
    });
    return;
  }

  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

// sign in user
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    res.status(404).json({ errors: ["O usuário não foi encontrado!"] });
    return;
  }

  if (!user.flag) {
    res.status(422).json({ errors: ["Conta inativa!"] });
    return;
  }

  // check if password matches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha inválida!"] });
    return;
  }

  // return user and token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

// get current logged in user
const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(201).json(user);
};

const update = async (req, res) => {
  const { name, password, newPassword, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id));

  if (newPassword && password) {
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(422).json({ errors: ["Senha atual inválida!"] });
      return;
    }

    if (newPassword.length < 5) {
      res.status(422).json({ errors: ["A senha precisa ter no mínimo cinco caracteres!"] });
      return;
    }

    user.password = (await generateHash(newPassword)).valueOf();
  }

  if (name) {
    user.name = name;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(new mongoose.Types.ObjectId(id)).select(
      "-password"
    );

    // check if user exists
    if (!user) {
      res.status(404).json({
        errors: ["Usuário não encontrado!"],
      });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({
      errors: ["Usuário não encontrado!"],
    });
  }
};

const follow = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id));

  const followedUser = await User.findById(new mongoose.Types.ObjectId(id));

  if (user._id.equals(followedUser._id)) {
    res
      .status(422)
      .json({ errors: ["Ocorreu um erro, tente novamente mais tarde!"] });
    return;
  }

  if (!user || !followedUser) {
    res.status(404).json({ errors: ["Usuário não encontrado!"] });
    return;
  }

  if (user.following.includes(followedUser._id)) {
    res.status(400).json({ errors: ["Usuário já está sendo seguido!"] });
    return;
  }

  user.following.push(followedUser._id);
  followedUser.followers.push(user._id);

  await user.save();
  await followedUser.save();

  res.status(200).json({
    userId: user._id,
    followedId: id,
    message: "Usuário seguido com sucesso!",
  });
};

const unfollow = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id));

  const unfollowedUser = await User.findById(new mongoose.Types.ObjectId(id));

  if (!user || !unfollowedUser) {
    res.status(404).json({ errors: ["Usuário não encontrado!"] });
    return;
  }

  if (!user.following.includes(unfollowedUser._id)) {
    res.status(400).json({ errors: ["Usuário ainda não está sendo seguido!"] });
    return;
  }

  user.following.pop(unfollowedUser._id);
  unfollowedUser.followers.pop(user._id);

  await user.save();
  await unfollowedUser.save();

  res.status(200).json({
    userId: user._id,
    unfollowedId: id,
    message: "Usuário removido com sucesso!",
  });
};

const removeFollower = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id));

  const removedFollower = await User.findById(new mongoose.Types.ObjectId(id));

  if (!user || !removedFollower) {
    res.status(404).json({ errors: ["Usuário não encontrado!"] });
    return;
  }

  if (!user.followers.includes(removedFollower._id)) {
    res.status(400).json({ errors: ["Usuário não te segue!"] });
    return;
  }

  user.followers.pop(removedFollower._id);
  removedFollower.following.pop(user._id);

  await user.save();
  await removedFollower.save();

  res.status(200).json({
    userId: user._id,
    unfollowedId: id,
    message: "Usuário removido com sucesso!",
  });
};

const getUserFollowed = async (req, res) => {
  const reqUser = req.user;

  const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id))
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(user.following);
};

const getUserFollowers = async (req, res) => {
  const reqUser = req.user;

  const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id))
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(user.followers);
};

const deactivateAccount = async (req, res) => {
  const reqUser = req.user;

  const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id));

  user.flag = false;

  await user.save();

  res.status(200).json({ userId: user._id, message: ["Desativado!"] });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
  follow,
  unfollow,
  removeFollower,
  getUserFollowed,
  getUserFollowers,
  deactivateAccount,
};
