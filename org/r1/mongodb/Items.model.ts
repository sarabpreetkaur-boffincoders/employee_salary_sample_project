import { getModelForClass, prop, mongoose } from "@typegoose/typegoose";

export class EmployeeItems {
  @prop()
  cardsArray!: mongoose.Types.ObjectId[];

  @prop()
  user_id!: mongoose.Types.ObjectId;
}
let items_model = getModelForClass(EmployeeItems);
export default items_model;
