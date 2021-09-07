//import mongoose from "mongoose";

import { getModelForClass, prop } from "@typegoose/typegoose";
import { Type } from "class-transformer";
export class Employeerecord {
  @prop()
  name!: string;
  @prop()
  email!: string;

  @prop()
  phone_no!: number;

  @prop()
  qualification!: string;
  @prop()
  password!: string;
}
const employeeRecordModel = getModelForClass(Employeerecord);
export default employeeRecordModel;
