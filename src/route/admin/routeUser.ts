import { Request, Response, Router } from "express";
import get from "lodash/get";
import { catchErrors } from "utils";
import User from "model/user";

const addUserRoute = async (router: Router) => {
  router.get("/user", catchErrors(getUsersHandler));
  // router.put('/user', updateUserHandler);
};

const getUsersHandler = async (req: Request, res: Response) => {
  const id = get(req, "user.id");
  const user = await User.findById(id, { password: 0 }).exec();
  res.send(user);
};

export default addUserRoute;
