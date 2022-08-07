import { Request, Response, NextFunction } from 'express';
import { SmartcarEngineAction } from '../enums/smartcar-engine-action.enum';

const engineActionValidation = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  const action = body.action;

  if(!action) {
    return res.status(400).json('Action is required.');
  }

  if(!Object.values(SmartcarEngineAction).includes(action.toUpperCase())) {
    return res.status(400).json(`Action must be ${SmartcarEngineAction.START} or ${SmartcarEngineAction.STOP}.`);
  }

  next();
}

export = engineActionValidation;
