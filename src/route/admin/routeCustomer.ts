import { Request, Response, Router } from "express";
import get from "lodash/get";
import { catchErrors, generateFieldsQuery } from "utils";
import Customer from "model/customer";

const addCustomerRoute = async (router: Router) => {
  router.get("/customer/:id", catchErrors(getHandler));
  router.get("/customers", catchErrors(getAllHandler));
  router.post("/customer", catchErrors(postHandler));
  router.put("/customer/:id", catchErrors(putHandler));
  router.delete("/customer/:id", catchErrors(deleteHandler));
};

const getHandler = async (req: Request, res: Response) => {
  const id = get(req, "params.id");
  const user = await Customer.findById(id).exec();
  res.send(user);
};

const getAllHandler = async (req: Request, res: Response) => {
  const { firstName, phone, address, page = 1, limit = 30 } = req.query;

  const query = generateFieldsQuery({ firstName, phone, address });

  const user = await Customer.find(
    query,
    {},
    {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sort: { _id: -1 },
    }
  );

  res.send(user);
};

const postHandler = async (req: Request, res: Response) => {
  const body = req.body;

  const customer = new Customer(body);
  await customer.save();

  res.send({ msg: "success" });
};

const putHandler = async (req: Request, res: Response) => {
  const id = get(req, "params.id");
  const body = req.body;

  await Customer.updateOne({ _id: id }, body).exec();

  res.send({ msg: "success" });
};

const deleteHandler = async (req: Request, res: Response) => {
  const id = get(req, "params.id");

  await Customer.deleteOne({ _id: id }).exec();

  res.send({ msg: "success" });
};

export default addCustomerRoute;
