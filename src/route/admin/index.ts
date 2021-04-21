import { Router } from "express";
import passport from "passport";
import addAuthRoute from "./routeAuth";
import addUserRoute from "./routeUser";

const addAdminRoute = (mainRouter: Router) => {
  // Route /admin
  const adminRouter = Router();
  mainRouter.use("/admin", adminRouter);
  addAuthRoute(adminRouter);

  // Route /admin/auth
  const authAdminRouter = Router();
  adminRouter.use(
    "/auth",
    passport.authenticate("jwt", { session: false }),
    authAdminRouter
  );

  addUserRoute(authAdminRouter);

  // Add more routes here
};

export default addAdminRoute;
