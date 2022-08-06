import { Request, Response, NextFunction } from 'express';
import { SmartcarEngineAction } from '../enums/smartcar-engine-action.enum';

const engineActionValidation = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  const action = body.action.toUpperCase();

  if(!Object.values(SmartcarEngineAction).includes(action)) {
    return res.status(400).json({ message : `Action must be ${SmartcarEngineAction.START} or ${SmartcarEngineAction.STOP}.` });
  }

  next();
};

export = engineActionValidation;
