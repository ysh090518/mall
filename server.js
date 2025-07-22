import express from "express";
const application = express();
import engine from "ejs-locals";
import path from "path";
import { fileURLToPath } from "url";
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);
import "./db.js";
import adminRouter from "./routes/admin.js";
import userRouter from "./routes/user.js";
import session from "express-session";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import itemRouter from "./routes/item.js";

let redisclient = createClient()
redisclient.connect().catch(console.error)
let redisStore = new RedisStore({
    client: redisclient,
})

application.use(express.static(path.join(__dirname, "public")));
application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use(
  session({
    secret: "popooopopoopoop",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: redisStore
  })
);

application.engine("ejs", engine);
application.set("view engine", "ejs");
application.set("views", path.join(__dirname, "views"));

application.get("/", (req, res) => {
  res.render("home", { title: "shoppingmall", products: [], user: req.session.user });
});

application.use("/admin", adminRouter);
application.use("/user", userRouter);
application.use("/item", itemRouter);

application.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});
