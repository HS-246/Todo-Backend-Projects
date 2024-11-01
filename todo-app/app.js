const express = require("express");
const csurf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("some secret string"));
app.use(csurf("1234567890thisisasecrt1234567089", ["POST", "PUT", "DELETE"]));
app.use(
  session({
    secret: "my-secret-key-r8973r0wr89s",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done("Invalid Password");
          }
        })
        .catch((err) => {
          return err;
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializing user :", user.firstName);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

//set EJS as view engine
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  response.render("index", {
    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const alltodos = await Todo.showList();
    if (request.accepts("html")) {
      return response.render("todos-page", {
        alltodos,
        csrfToken: request.csrfToken(),
      });
    } else {
      return response.json(alltodos);
    }
  }
);

app.post("/todos", async (request, response) => {
  console.log("Get Todo", request.body);

  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });

    return response.redirect("/");
  } catch (err) {
    console.log(err);
    return response.status(422);
  }
});

app.put("/todos/:id/update", async (request, response) => {
  console.log("update with id: ", request.params.id);
  try {
    //const todo = await Todo.findByPk(request.params.id);
    const updated = await Todo.Update(request.params.id);
    console.log(`${updated.id} ${updated.completed}`);

    return response.json(updated);
  } catch (err) {
    console.log(err);
    return response.status(422);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("Deleteing todo with id: ", request.params.id);
  const deleted = await Todo.delete(request.params.id);
  if (deleted) return response.send(true);
  return response.send(false);
});

app.get("/signup", (request, response) => {
  if (request.accepts("html")) {
    return response.render("signup", { csrfToken: request.csrfToken() });
  } else {
    return response.send("Signup page");
  }
});

app.post("/users", async (request, response) => {
  //hash passowrd
  const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);

  try {
    const user = await User.addUser({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPassword,
    });
    request.login(user, (err) => {
      console.error(err);
    });
    return response.redirect("/todos");
  } catch (err) {
    console.error(err);
  }
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  async (request, response) => {
    return response.redirect("/todos");
  }
);

app.get("/login", async (request, response) => {
  if (request.accepts("html")) {
    return response.render("login", { csrfToken: request.csrfToken() });
  } else {
    return response.send("Login page");
  }
});

module.exports = app;
