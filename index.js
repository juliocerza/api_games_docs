const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const JWTSecret = "$pwd$Ba2";
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function auth(req, res, next) {
  const authToken = req.headers["authorization"];
  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    let token = bearer[1];
    jwt.verify(token, JWTSecret, (err, data) => {
      if (err) {
        res.status(401).send("Token inválido");
      } else {
        req.token = token;
        req.loggedUser = { id: data.id, email: data.email };
        next();
      }
    });
  } else {
    res.status(401).send("Token inválido");
  }
}

const PORT = 3000;

let DB = {
  games: [
    {
      id: 1,
      title: "Call of Duty MW",
      year: 2019,
      price: 60,
    },
    {
      id: 2,
      title: "Roblox",
      year: 1990,
      price: 30,
    },
    {
      id: 3,
      title: "Minecraft",
      year: 2019,
      price: 10,
    },
  ],
  users: [
    {
      id: 1,
      name: "Cesar Rocha",
      email: "cesar@dev.com",
      password: "123",
    },
    {
      id: 10,
      name: "Julio Rocha",
      email: "julio@dev.com",
      password: "1243",
    },
  ],
};

app.get("/games", auth, (req, res) => {
  res.statusCode = 200;
  res.json(DB.games);
});

app.get("/games/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    let id = parseInt(req.params.id);
    let game = DB.games.find((g) => g.id === id);
    if (game != undefined) {
      res.status(200).send(game);
    } else {
      res.status(404).send("Não encontrado");
    }
  }
});

app.post("/games", auth, (req, res) => {
  let { title, year, price } = req.body;
  DB.games.push({
    id: 4,
    title,
    year,
    price,
  });
  res.sendStatus(200);
});

app.delete("/games/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    let id = parseInt(req.params.id);
    let index = DB.games.findIndex((g) => g.id === id);
    if (index == -1) {
      res.status(404).send("Não encontrado");
    } else {
      DB.games.splice(index, 1);
      res.sendStatus(200);
    }
  }
});

app.put("/games/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    let id = parseInt(req.params.id);
    let game = DB.games.find((g) => g.id === id);
    if (game != undefined) {
      let { title, year, price } = req.body;
      if (title != undefined) {
        game.title = title;
      }
      if (year != undefined) {
        game.year = year;
      }
      if (price != undefined) {
        game.price = price;
      }
      res.sendStatus(200);
    } else {
      res.status(404).send("Não encontrado");
    }
  }
});

app.post("/auth", (req, res) => {
  let { email, password } = req.body;
  if (email != undefined) {
    let user = DB.users.find((u) => u.email == email);
    if (user != undefined) {
      if (user.password == password) {
        jwt.sign(
          { id: user.id, email: user.email },
          JWTSecret,
          { expiresIn: "100h" },
          (err, token) => {
            if (err) {
              res.status(400).json({ err: "Falha interna" });
            } else {
              res.status(200).json({ token: token });
            }
          }
        );
      } else {
        res.status(401).send("Não autorizado!");
      }
    } else {
      res.status(404).send("Email inexistente");
    }
  } else {
    res.status(400).send("Email inválido");
  }
});

app.listen(PORT, () => {
  console.log("API is running");
});
