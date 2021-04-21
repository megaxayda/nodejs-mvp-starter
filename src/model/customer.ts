import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    email: String,
  },
  { timestamps: true }
);

const Model = model("Customer", schema, "customer");

export default Model;
