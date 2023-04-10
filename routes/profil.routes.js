const router = require("express").Router();
const User = require("../models/User.model.js");

const isAuthenticated = require("../middlewares/auth.middlewares.js");

//GET "/" => render information from profil
router.get("/", isAuthenticated, async (req, res, next) => {
  const { _id } = req.payload;

  try {
    const response = await User.findById(_id)
      .populate("friends", "name")
      .select("-password");

    res.json(response);
  } catch (error) {
    next(error);
  }
});

//PATCH "/:id" => edit of profil
router.patch("/", isAuthenticated, async (req, res, next) => {
  const { _id } = req.payload;
  const { name, imageProfile, description, age, activity, lieux } = req.body;

  try {
    const foundUsername = await User.findOne({ name: name });

    if (foundUsername !== null) {
      res.status(400).json({ errorMessage: "This name has already been used" });
      return;
    }

    await User.findByIdAndUpdate(_id, {
      name,
      imageProfile,
      description,
      age,
      activity,
      lieux
      
    });
    res.json("the edit it's OK");
  } catch (error) {
    next(error);
  }
});
//PATCH "/:id" => add friend and remove to profil
router.patch("/:usernameProfil", isAuthenticated, async (req, res, next) => {
  const { _id } = req.payload;
  const { usernameProfil } = req.params;

  try {
    const idFriend = await User.findOne({ name: usernameProfil }).select("_id");
    const alreadyFriend = await User.findById(_id).select("friends");

    const friendIds = alreadyFriend.friends.map((friend) => friend.toString());
    const objIdToString = idFriend._id.toString();

    if (!friendIds.includes(objIdToString)) {
        await User.findByIdAndUpdate(_id, {
            $push: { friends: idFriend },
          });
          res.json("Friend is add");
          return
    } else {
        await User.findByIdAndUpdate(_id, {
            $pull: { friends: idFriend._id },
          });
          res.json("Friend is remove");
          return
    }

    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
