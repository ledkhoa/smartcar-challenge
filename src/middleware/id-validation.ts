import { Request, Response, NextFunction } from 'express';

const idValidation = (req: Request, res: Response, next: NextFunction) => {
  const id = +req.params.id;

  if (isNaN(id)) {
    return res.status(400).json({ message: "Vehicle id must be a number." });
  }

  next();
};

export = idValidation;
