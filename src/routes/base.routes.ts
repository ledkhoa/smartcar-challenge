import { Request, Response, Router } from "express";
import engineActionValidation from "../middleware/engine-action-validation";
import idValidation from "../middleware/id-validation";
import * as GMService from "../services/gm-service";

const router = Router();

router.get('/vehicles/:id', idValidation, async (req: Request, res: Response) => {
    const id = +req.params.id;

    try {
        const vehicle = await GMService.getVehicleInfo(id);
        
        if(vehicle) {
            return res.status(200).json(vehicle);
        }
        
        res.status(404).json(`Vehicle with id ${id} not found.`);
    } catch(e: any) {
        console.log(`GET /vehicles/:id`, e);
        res.status(500).json(e.message);
    }
});

router.get('/vehicles/:id/doors', idValidation, async (req: Request, res: Response) => {
    const id = +req.params.id;

    try {
        const securityStatus = await GMService.getSecurityStatus(id);

        if(securityStatus) {
            return res.status(200).json(securityStatus);
        }

        res.status(404).json(`Vehicle with id ${id} not found.`);
    } catch(e: any) {
        console.log(`GET /vehicles/:id/doors`, e);
        res.status(500).json(e.message);
    }
});

router.get('/vehicles/:id/fuel', idValidation, async (req: Request, res: Response) => {
    const id = +req.params.id;

    try {
        const fuelRange = await GMService.getFuel(id);

        if(fuelRange) {
            return res.status(200).json(fuelRange);
        }

        res.status(404).json(`Vehicle with id ${id} not found.`);
    } catch(e: any) {
        console.log(`GET /vehicles/:id/fuel`, e);
        res.status(500).json(e.message);
    }
});

router.get('/vehicles/:id/battery', idValidation, async (req: Request, res: Response) => {
    const id = +req.params.id;

    try {
        const batteryRange = await GMService.getBattery(id);

        if(batteryRange) {
            return res.status(200).json(batteryRange);
        }

        res.status(404).json(`Vehicle with id ${id} not found.`);
    } catch(e: any) {
        console.log(`GET /vehicles/:id/battery`, e);
        res.status(500).json(e.message);
    }
});

router.post('/vehicles/:id/engine', idValidation, engineActionValidation, async (req: Request, res: Response) => {
    const id = +req.params.id;
    const action = req.body.action.toUpperCase();

    try {
        const engineActionStatus = await GMService.setEngineAction(id, action);

        if(engineActionStatus) {
            return res.status(200).json(engineActionStatus);
        }

        return res.status(404).json(`Vehicle with id ${id} not found.`);
    } catch(e: any) {
        console.log(`POST /vehicles/:id/engine`, e);
        res.status(500).json(e.message);
    }
});

export = router;