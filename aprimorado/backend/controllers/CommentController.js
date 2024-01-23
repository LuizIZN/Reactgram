const Photo = require("../models/Photo");
const User = require("../models/User");
const Comment = require("../models/Comment");

const insertComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const photo = await Photo.findById(id);

  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada!"] });
    return;
  }

  const newComment = await Comment.create({
    comment,
    userId: user._id,
    photoId: photo._id,
  });

  if (!newComment) {
    res.status(422).json({
      errors: ["Houve um problema, por favor, tente novamente mais tarde."],
    });
    return;
  }

  photo.comments.push(newComment._id);

  await photo.save();

  res.status(200).json({
    comment: newComment._id,
    message: "O comentário foi adicionado com sucesso!",
  });
};

const likeComment = async (req, res) => {
  const { idComment } = req.params;

  const reqUser = req.user;

  const comment = await Comment.findById(idComment);

  if (!comment) {
    res.status(404).json({ errors: ["Comentário não encontrado!"] });
    return;
  }

  if (comment.likes.includes(reqUser._id)) {
    res
      .status(422)
      .json({ errors: ["Ocorreu um erro, tente novamente mais tarde."] });
    return;
  }

  comment.likes.push(reqUser._id);

  await comment.save();

  res.status(200).json({
    commentId: idComment,
    userId: reqUser._id,
    message: "Curtida adicionada!",
  });
};

const dislikeComment = async (req, res) => {
  const { idComment } = req.params;

  const reqUser = req.user;

  const comment = await Comment.findById(idComment);

  if (!comment) {
    res.status(404).json({ errors: ["Comentário não encontrado!"] });
    return;
  }

  if (!comment.likes.includes(reqUser._id)) {
    res.status(422).json({
      errors: ["Ocorreu um erro, por favor, tente novamente mais tarde!"],
    });
    return;
  }

  comment.likes.pop(reqUser._id);

  await comment.save();

  res.status(200).json({
    commentId: idComment,
    userId: reqUser._id,
    message: "Curtida removida!",
  });
};

const deleteComment = async (req, res) => {
  const { idComment } = req.params;
  const reqUser = req.user;

  const comment = await Comment.findById(idComment);

  const photo = await Photo.findById(comment.photoId);

  if (!comment.userId.equals(reqUser._id) || !comment || !photo) {
    res.status(422).json({
      errors: ["Ocorreu um erro, por favor, tente novamente mais tarde!"],
    });
    return;
  }
  
  try {
    await Comment.findByIdAndDelete(comment._id);
  } catch (err) {
    res.status(422).json({
      errors: ["Ocorreu um erro, por favor, tente novamente mais tarde!"],
    });
    return;
  }

  photo.comments.pop(idComment);

  await photo.save();

  res.status(200).json({
    comment,
    message: "Comentário removido!",
  });
};

module.exports = {
  insertComment,
  likeComment,
  dislikeComment,
  deleteComment,
};
