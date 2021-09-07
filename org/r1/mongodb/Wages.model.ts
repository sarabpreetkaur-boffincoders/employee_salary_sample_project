import { getModelForClass, prop } from "@typegoose/typegoose";

export class Wages{
    @prop()
    Salary!:number
}
const wagesModel=getModelForClass(Wages);
export default wagesModel;