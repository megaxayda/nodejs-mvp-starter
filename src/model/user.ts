import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    username: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
  },
  { timestamps: true }
);

const Model = model("User", schema, "user");

export default Model;
