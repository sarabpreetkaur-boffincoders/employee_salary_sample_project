const jwt_secret = "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfgjkdhfjk";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { IAPIResponse } from "../../../Interfaces/response.interface";
import employeeRecordModel from "../mongodb/employeeRecord.model";
import { Transform } from "class-transformer";
import EmployeeSchema, { Employeerecord } from "../mongodb/employeeRecord.model";

export class Validation {
  data: any;
  error: any;
}
export class ErrorResponse {
  error:any;
  message:any;
}
class Utility {

  authenticateJwt = async (
    req: Request,
    res: Response<IAPIResponse>,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (token) {
        jwt.verify(token, jwt_secret, async (err: any, token: any) => {
          if (err) {
            return res.send(err);
          }
          let user = await employeeRecordModel.findOne({
            _id: token.user_id,
          });
          if (user) {
            req.body.user = user;
            next();
          } else {
            return res.send({
              success: false,
              message: "invalid token",
              
            });
          }
        });
      } else {
        return res.send({
          success: false,
          message: "invalid token",
         
        });
      }
    } catch (err) {
      return res.send({
        success: false,
        message: err,
        
      });
    }
  };
  validateAndConvert = async (validateConvertedData: any, body: any) => {
    const result = new Validation();
    result.data = plainToClass(validateConvertedData, body);
    await validate(result.data, { skipMissingProperties: true }).then(
      (errors) => {
        if (errors.length > 0) {
          result.error = errors.map((err) => err.constraints);
          return result;
        }
      }
     
    );
    return result;
  };
   isEmpty=async (obj:any)=> {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

  

}
export function ToBoolean(): (target: any, key: string) => void {

  return Transform(
    (value: any) =>{
      if(typeof value.value==="boolean"){
        return value.value
      }
      else if(value.value === "true" || value.value === true || value.value === 1 || value.value === "1")
      {
      return true
      }
      else
      return false
    }

 );
};
export default new Utility();
