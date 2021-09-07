import { mongoose } from "@typegoose/typegoose";
import { Expose, Type } from "class-transformer";
import {
  IsString,
  IsDefined,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsBoolean,
  IsNumber,
  IsArray,
  IsEnum,
} from "class-validator";
import "reflect-metadata";
import { ToBoolean } from "../common/utility";
enum abc {
  laptop,
  lunchCard,
  headphones,
  cabCard,
  tea,
}

export class Employee {
  @Expose()
  @IsDefined()
  @IsString()
  name!: string;
  @Expose()
  @IsDefined()
  @IsString()
  @IsEmail()
  email!: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @Matches(/((?=.*\d)|(?=.*\W+))(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password too weak",
  })
  password!: string;

  @Expose()
  @IsDefined()
  @IsString()
  qualification!: string;

  @Expose()
  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  phone_no!: number;
}
export class Employeelogin {
  @Expose()
  @IsDefined()
  @IsString()
  @IsEmail()
  email!: string;
  @Expose()
  @IsDefined()
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?=.*[A-Z])(?=.*[a-z]).*$/)
  password!: string;
}
export class ItemsViewModel {
  @Expose()
  cardsArray?: unknown[];

  @Expose()
  @IsDefined()
  @IsArray()
  @IsEnum(abc, { each: true })
  item_name!: string[];

  @Expose()
  user_id: mongoose.Types.ObjectId;
}
export class Wages {
  @Expose()
  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  Salary!: number;
}
export class ItemsCost {
  @Expose()
  @IsDefined()
  @IsString()
  card_name!: string;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  value!: number;
}
