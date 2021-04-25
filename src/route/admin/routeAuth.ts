import { Router, Request, Response } from "express";
import isEmpty from "lodash/isEmpty";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchErrors } from "../../utils";
import User from "../../model/user";
const SALT_ROUNDS = 10;

const addAuthRoute = async (router: Router) => {
  router.post("/login", catchErrors(loginHandler));
  router.post("/register", catchErrors(registerHandler));
};

const loginHandler = async (req: Request, res: Response) => {
  const body = req.body;

  const user = await User.findOne(
    { username: body.username },
    "password"
  ).exec();

  if (isEmpty(user)) {
    res.status(400).send({ msg: "Wrong username or password" });
    return;
  }

  const passCorrect = await bcrypt.compare(body.password, user.password);

  if (passCorrect) {
    const token = await jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.SECRET || "123456789",
      { expiresIn: "30d" }
    );

    res.send({ token });
  } else {
    res.status(400).send({ msg: "Wrong username or password" });
  }
};

const registerHandler = async (req: Request, res: Response) => {
  const body = req.body;

  if (body.adminPass !== process.env.ADMIN_PASSWORD) {
    res.status(400).send({ msg: "" });
    return;
  }

  const hash = await bcrypt.hash(body.password, SALT_ROUNDS);

  const user = new User({ ...body, password: hash });

  await user.save();

  res.send({
    msg: "success",
  });
};

export default addAuthRoute;
