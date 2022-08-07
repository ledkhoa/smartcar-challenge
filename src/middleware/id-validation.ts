import { Request, Response, NextFunction } from 'express';

/*
  Based on documentation and for the sake of simplicity of the challenge, 
  I assume that ID must be numeric.
*/
const idValidation = (req: Request, res: Response, next: NextFunction) => {
  const id = +req.params.id;

  if(isNaN(id)) {
    return res.status(400).json('Vehicle id must be a number.');
  }

  next();
}

export = idValidation;
