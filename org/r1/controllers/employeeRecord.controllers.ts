import { NextFunction, Request, Response } from "express";
import EmployeeSchema, {
  Employeerecord,
} from "../mongodb/employeeRecord.model";
import {
  Employee,
  Employeelogin,
  ItemsViewModel,
  ItemsCost,
  Wages,
} from "../viewModel/employee_view_model";
//import bcrypt from "bcryptjs";

import {
  IAPIResponse,
  IServiceResponse,
} from "../../../Interfaces/response.interface";
const JWT_SECRET = "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfgjkdhfjk";
import tokenIssuer from "../tokenIssuer";
import Items_model from "../mongodb/Items.model";
import utility, { Validation } from "../common/utility";
import employee_service from "../services/index";
import STATUS_CODES from "http-status";
import httpStatus from "http-status";

/**
 * @swagger
 * /org/r1/Data/AddRecords:
 *   post:
 *     tags:
 *      - Auth
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: Leanne Graham
 *               qualification:
 *                 type: string
 *                 description: quali
 *               email:
 *                type: string
 *               password:
 *                type: string
 *               phone_no:
 *                type: number   
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 */
export const signupRecords = async (
  req: Request,
  res: Response<IAPIResponse>,
  next: NextFunction
) => {
  try {
    let validatedResult: Validation = await utility.validateAndConvert(
      Employee,
      req.body
    );
    if (validatedResult.error) {
      return res.send({
        success: false,
        message: "validation error occured",
        data: validatedResult.error,
      });
    } else {
      let new_employee: Employee = validatedResult.data as Employee;
      let employee_created_result = await employee_service.employee_data(
        new_employee,
        req
      );
      //console.log(employee_created_result)
      if (employee_created_result.status_code === httpStatus.OK) {
        return res.send({
          success: true,
          message: "employee_record added",
          data: employee_created_result.data,
        });
      } else {
        return res.send({
          success: false,
          message: "employee_record not added",
          data: employee_created_result.data,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "Internal server error",
    });
  }
};

export const Login = async (
  req: Request,
  res: Response<IAPIResponse>,
  next: NextFunction
) => {
  try {
    let validated_user: Validation = await utility.validateAndConvert(
      Employeelogin,
      req.body
    );
    if (validated_user.error) {
      return res.send({
        success: false,
        message: "validation error occured",
        data: validated_user.error,
      });
    } else {
      let login_user: Employeelogin = validated_user.data as Employeelogin;
      let login_user_service = await employee_service.employee_login_data(
        login_user,
        req
      );
      //console.log(login_user_service);

      if (login_user_service.status_code === httpStatus.OK) {
        return res.status(STATUS_CODES.OK).send({
          success: true,
          message: "User login successfully",
          data: {
            name: login_user_service.data.data.name,
            email: login_user_service.data.data.email,
            phone_no: login_user_service.data.data.phone_no,
            qualification: login_user_service.data.data.qualification,
            token: login_user_service.data.token,
          },
        });
      } else {
        return res.status(STATUS_CODES.BAD_REQUEST).send({
          success: false,
          message: "login failed",
          data: login_user_service.data,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "Internal server error",
    });
  }
};
//
export const getItems = async (
  req: Request,
  res: Response<IAPIResponse>,
  next: NextFunction
) => {
  try {
    let validated_items: Validation = await utility.validateAndConvert(
      ItemsViewModel,
      req.body
    );
    if (validated_items.error) {
      return res.send({
        success: false,
        message: "validation error occured",
        data: validated_items.error,
      });
    } else {
      let Items_card: ItemsViewModel = validated_items.data as ItemsViewModel;
      let items_card_service = await employee_service.employee_items_data(
        Items_card,
        req
      );
      if (items_card_service.status_code === httpStatus.OK) {
        return res.status(STATUS_CODES.OK).send({
          success: true,
          data: items_card_service.data,
          message: "Items added to your account",
        });
      } else {
        return res.status(STATUS_CODES.BAD_REQUEST).send({
          success: false,
          data: items_card_service.data,
          message: "Items can't be added to your account",
        });
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: "Internal server error",
    });
  }
};

export const detailedItems = async (
  req: Request,
  res: Response<IAPIResponse>,
  next: NextFunction
) => {
  try {
    let items_detail = await employee_service.employee_items_detail(req);
    if (items_detail.status_code === httpStatus.OK) {
      return res.status(STATUS_CODES.OK).send({
        success: true,
        message: "Detail of item tokens taken by an employee.",
        data: items_detail.data,
      });
    } else {
      return res.status(STATUS_CODES.BAD_REQUEST).send({
        success: false,
        message: "Detail of item tokens taken by an employee.",
        data: items_detail.data,
      });
    }
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: "Internal server error.",
    });
  }
};
export const itemsPrice = async (
  req: Request,
  res: Response<IAPIResponse>,
  next: NextFunction
) => {
  try {
    let validated_items: Validation = await utility.validateAndConvert(
      ItemsCost,
      req.body
    );
    if (validated_items.error) {
      return res.send({
        success: false,
        message: "validation error occured",
        data: validated_items.error,
      });
    } else {
      let items: ItemsCost = validated_items.data as ItemsCost;
      let items_price = await employee_service.employee_items_price(items);
      if (items_price.status_code === httpStatus.OK) {
        return res.send({
          success: true,
          message: "Items with their costs.",
          data: items_price.data,
        });
      } else {
        return res.send({
          success: false,
          message: "Items with their costs.",
          data: items_price.data,
        });
      }
    }
  } catch (error) {
    return res.send({
      success: false,
      message: "Internal server error.",
    });
  }
}; 

export const totalSalary = async (
  req: Request,
  res: Response<IAPIResponse>,
  next: NextFunction
) => {
  try {
    let validated_items: Validation = await utility.validateAndConvert(
      Wages,
      req.body
    );
    if (validated_items.error) {
      return res.send({
        success: false,
        message: "validation error occured",
        data: validated_items.error,
      });
    }
    else{
      let price_detail =await validated_items.data as Wages;
      let Salary_allowance=await employee_service.employee_salary(price_detail,req);
      
if(Salary_allowance.status_code===httpStatus.OK){
  return res.send({
    success: true,
    message: "your total salary of this month",
    data:Salary_allowance.data,
  })
}else
{
  return res.send({
    success: false,
    message: "your total salary of this month",
    data:Salary_allowance.data,
  })
}


    }}
    catch(error){
      return res.send ({
        success:false,
        message:"Internal server error",

      })
    
      }
    
};

//let { lc, cc, laptop, hp, tea } = req.body;
//     let founduser = req.body.user;
//     if (founduser) {
//       let newItems = await Items.create({
//         lunchCard: lc,
//         cabCard: cc,
//         laptop: laptop,
//         headphones: hp,
//         tea: tea,
//       });
//       if (newItems) {
//         return res.send({
//           status: true,
//           msg: "you have chosen cards.",
//           parm: "",
//           location: "Database",
//         });
//       } else {
//         return res.send({
//           status: false,
//           msg: "cards are not chosen",
//           parm: "",
//           location: "Database",
//         });
//       }
//     }
//   } catch (err) {
//     return res.send({
//       status: false,
//       msg: err,
//       parm: "",
//       location: "Database",
//     });
//   }
// }
