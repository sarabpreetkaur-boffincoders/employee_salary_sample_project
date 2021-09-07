import { getModelForClass, prop } from "@typegoose/typegoose";

export class Employee_items_price{

    @prop()
    card_name!:string;

    @prop()
    value!:number;
    
}
let items_price=getModelForClass(Employee_items_price)

 export default items_price;