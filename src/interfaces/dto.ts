import { Request, Response } from "express";

export interface IRequest extends Request {
  body: any;
  query: any;
  user?: any;
  file?: any;
}

export interface IResponse extends Response {
  metadata?: any;
}
