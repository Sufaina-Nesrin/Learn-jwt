const express = require("express");
const users = require("./user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());



let refreshTokens = [];

generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "5s" }
  );
};


generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.JWT_REFRESH_SECRET
  );
};



//here i am setting token with expiring time and refreshin the token when it refresh
app.post("/api/refresh", (req, res) => {
  //TAKE REFRESH TOKEN FROM THE USER
  const refreshToken = req.body.token;

  //SEND ERROR IF THERE IS NO TOKEN OR ITS INVALID
  if (!refreshToken) return res.status(401).json("you are not authenticated");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid");
  }

  //IF EVERYTHING IS OK,CREATE NEW ACCESS TOKEN,REFRESH TOKEN AND SEND TO USER
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).json("Refresh token is not valid");
    }
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
});



//LOGIN
app.post("/api/login", (req, res) => {
  const { name, password } = req.body;
  const user = users.find((u) => {
    return u.name === name && u.password === password;
  });
  if (user) {
    // res.status(200).json(user)
    //GENERATE AN ACCESS TOKEN
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.json({
      id: user.id,
      name: user.name,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(404).json("not found");
  }
});


//VERIFY FUNCTION
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json("Token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated");
  }
};


//DELETE A USER
app.delete("/api/users/:id", verify, (req, res) => {
  console.log(req.user.id, req.params.id);
  if (req.user.id === req.params.id || req.user.isAdmin) {
    res.status(200).json("user has been deleted");
  } else {
    res.status(403).json("You are not allowed to delete this user");
  }
});


//LOGOUT
app.post("/api/logout", verify, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("you have logged out successfully");
});



app.listen(5000, () => {
  console.log("Backend is running");
});

//IF YOU DONT UNDERSTAND THIS JUST CHECK THE---->>> ./refresh.txt
