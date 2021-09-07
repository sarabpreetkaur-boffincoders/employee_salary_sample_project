import { Request } from "express";
import {
  Employee,
  Employeelogin,
  ItemsViewModel,
  ItemsCost,
  Wages,
} from "../viewModel/employee_view_model";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import employeeRecordModel, {
  Employeerecord,
} from "../mongodb/employeeRecord.model";
const JWT_SECRET = "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfgjkdhfjk";

import tokenIssuer from "../tokenIssuer";
import { v4 } from "uuid";
import { IServiceResponse } from "../../../Interfaces/response.interface";
import httpStatus from "http-status";
import Items_model from "../mongodb/Items.model";
import items_price from "../mongodb/employeeItems.model";
import { validate } from "class-validator";
import { mongoose } from "@typegoose/typegoose";
import items_model from "../mongodb/Items.model";
import { totalSalary } from "../controllers/employeeRecord.controllers";

class Employeeservice {
  employee_data = async (
    new_employee: Employee,
    req: Request
  ): Promise<IServiceResponse> => {
    try {
      let existing_email = await employeeRecordModel.findOne({
        email: new_employee.email,
      });
      if (existing_email) {
        return {
          status_code: httpStatus.BAD_REQUEST,
          data: {
            error: "on add error",
            message: "email already exists.",
          },
        };
      }
      const salt = await bcrypt.genSalt(10);

      new_employee.password = await bcrypt.hash(new_employee.password, salt);

      //console.log(new_employee.password)
      let employee_record = await employeeRecordModel.create(new_employee);
      if (employee_record)
        return {
          status_code: httpStatus.OK,
          data: employee_record,
        };
      else {
        return {
          status_code: httpStatus.BAD_REQUEST,
          data: {
            error: "error occured while adding employee record.",
            message: "An error occured.",
          },
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status_code: httpStatus.BAD_REQUEST,
        data: { error: "On add error", message: "Internal server error." },
      };
    }
  };

  employee_login_data = async (
    login_user: Employeelogin,
    req: Request
  ): Promise<IServiceResponse> => {
    try {
      let MatchedUser = await employeeRecordModel.findOne({
        email: login_user.email,
      });

      if (!MatchedUser) {
        return {
          status_code: httpStatus.BAD_REQUEST,
          data: {
            message: "email does not matches.",
            error: "email error occured.",
          },
        };
      } else {
        let matchedPass = await bcrypt.compare(
          login_user.password,
          MatchedUser.password
        );
        console.log(matchedPass);
        if (!matchedPass) {
          return {
            status_code: httpStatus.BAD_REQUEST,
            data: {
              message: "password does not matches.",
              error: "password error occured.",
            },
          };
        } else {
          const token = jwt.sign(
            {
              email: MatchedUser.email,
              user_id: MatchedUser._id,
              jwtid: v4(),
            },
            JWT_SECRET,
            {
              issuer: tokenIssuer.issuer,
            }
          );
          return {
            status_code: httpStatus.OK,
            data: { data: MatchedUser, token: token },
          };
        }
      }
    } catch (error) {
      return {
        status_code: httpStatus.INTERNAL_SERVER_ERROR,
        data: {
          error: "Login error .",
          message: "Internal server error.",
        },
      };
    }
  };

  employee_items_data = async (
    Items_card: ItemsViewModel,
    req: Request
  ): Promise<IServiceResponse> => {
    try {
      let found_user = req.body.user;
      Items_card.user_id = found_user._id;

      Items_card.cardsArray = new Array<mongoose.Types.ObjectId>();

      let MatchedItems = await items_price.find({
        card_name: { $in: Items_card.item_name },
      });

      MatchedItems.map((Id) => {
        Items_card.cardsArray.push({
          _id: Id._id,
          value: Id.value,
          card_name: Id.card_name,
        });
      });
      if (MatchedItems) {
        let find_existing_user = await items_model.find({
          user_id: found_user._id,
        });
        if (find_existing_user.length > 0) {
          let update_data = await Items_model.updateOne({
            user_id: found_user._id,
            $set: { cardsArray: Items_card.cardsArray },
          });
          if (update_data.nModified > 0) {
            return {
              status_code: httpStatus.OK,
              data: {
                message: " record updated",
                data: {
                  cardsArray: Items_card.cardsArray,
                  user_id: Items_card.user_id,
                },
              },
            };
          } else {
            return {
              status_code: httpStatus.BAD_REQUEST,
              data: {
                message: " record not updated",
              },
            };
          }
        } else {
          let items_data = await Items_model.create(Items_card);
          if (items_data) {
            return {
              status_code: httpStatus.OK,
              data: { items_data },
            };
          } else {
            return {
              status_code: httpStatus.BAD_REQUEST,
              data: {
                error: "On add error ",
                message: "Items can't be added.",
              },
            };
          }
        }
      } else {
        return {
          status_code: httpStatus.BAD_REQUEST,
          data: {
            message: "Items are not correct please enter valid items",
          },
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status_code: httpStatus.INTERNAL_SERVER_ERROR,
        data: {
          error: "On add error",
          message: "Internal server error",
        },
      };
    }
  };

  employee_items_detail = async (req: Request): Promise<IServiceResponse> => {
    try {
      let get_detail = await Items_model.findOne({
        user_id: req.body.user._id,
      });
      if (get_detail) {
        return {
          status_code: httpStatus.OK,
          data: get_detail,
        };
      } else {
        return {
          status_code: httpStatus.BAD_REQUEST,
          data: {
            error: "DetailView error",
            message: "An error occured.",
          },
        };
      }
    } catch (error) {
      return {
        status_code: httpStatus.INTERNAL_SERVER_ERROR,
        data: {
          error: "View error",
          message: "Internal server error",
        },
      };
    }
  };
  employee_salary = async (Wages_data: Wages, req: Request) => {
    try {
      let Gratuity = 0;
      let allowances = new Array();
      let found_user = req.body.user;
      let found_user_items = await items_model.findOne({
        user_id: mongoose.Types.ObjectId(found_user._id),
      });

      allowances = found_user_items.cardsArray;
      // console.log(allowances)
      allowances.forEach((cost) => {
        Gratuity += cost.value;
      });
      //console.log(total)
      if (Gratuity) {
        let Monthly_salary = Wages_data.Salary + Gratuity;
        if (Monthly_salary) {
          return {
            status_code: httpStatus.OK,
            data: Monthly_salary,
          };
        }
      } else {
        return {
          status_code: httpStatus.BAD_REQUEST,
          data: {
            message: "On Add error",
          },
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status_code: httpStatus.INTERNAL_SERVER_ERROR,
        data: {
          error: "On add error",
          message: "An error occured.",
        },
      };
    }
  };

  employee_items_price = async (
    prices: ItemsCost
  ): Promise<IServiceResponse> => {
    try {
      let check_duplicacy = await items_price.findOne({
        card_name: prices.card_name,
      });
      if (check_duplicacy != 0) {
        return {
          status_code: httpStatus.CONFLICT,
          data: "Card already exists",
        };
      } else {
        let items_cost = await items_price.create(prices);
        if (items_cost) {
          return {
            status_code: httpStatus.OK,
            data: items_cost,
          };
        } else {
          return {
            status_code: httpStatus.BAD_REQUEST,
            data: {
              error: "On add error",
              message: " costs of data items are not added.",
            },
          };
        }
      }
    } catch (error) {
      return {
        status_code: httpStatus.INTERNAL_SERVER_ERROR,
        data: {
          error: "On add error",
          message: "Internal server error",
        },
      };
    }
  };
}

export default new Employeeservice();
