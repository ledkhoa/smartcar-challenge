import axios from 'axios';
import { GM_SERVICE_URL } from '../config';
import { GMEngineActionStatus } from '../enums/gm-engine-action-status.enum';
import { GMEngineAction } from '../enums/gm-engine-action.enum';
import { SmartcarEngineActionStatus } from '../enums/smartcar-engine-action-status.enum';
import { SmartcarEngineAction } from '../enums/smartcar-engine-action.enum';
import { mapToEnergyLevel, mapToSecurityStatus, mapToVehicle } from '../mappers/gm-mapper';
import EnergyLevel from '../models/energy-level.model';
import EnergyPercentage from '../models/energy-percentage.model';
import EngineActionStatus from '../models/engine-action-status.model';
import SecurityStatus from '../models/security-status.model';
import Vehicle from '../models/vehicle.model';

const url = GM_SERVICE_URL;
const gmRequest = {
    responseType: 'JSON'
};

export const getVehicleInfo = async (id: number): Promise<Vehicle|null> => {
    const request = {
        ...gmRequest,
        id
    };

    const res = await axios.post(`${url}/getVehicleInfoService`, request);

    if(res.data.status === '200') {          
        return mapToVehicle(res.data.data);
    }
    
    return null;
}

export const getSecurityStatus = async (id: number): Promise<SecurityStatus[]|null> => {
    const request = {
        ...gmRequest,
        id
    };

    const res = await axios.post(`${url}/getSecurityStatusService`, request);

    if(res.data.status === '200') {
        return mapToSecurityStatus(res.data.data);
    }

    return null;
}

export const getFuel = async (id: number): Promise<EnergyPercentage|null> => {
    const energyLevels = await getEnergyLevel(id);

    if(energyLevels) {
        if(energyLevels.tank) {
            return {
                percent: energyLevels.tank
            }
        }
        throw new Error(`Vehicle id ${id} is not a gas vehicle.`);
    }

    return null;
}

export const getBattery = async (id: number): Promise<EnergyPercentage|null> => {
    const energyLevels = await getEnergyLevel(id);

    if(energyLevels) {
        if(energyLevels.battery) {
            return {
                percent: energyLevels.battery
            }
        }
        throw new Error(`Vehicle id ${id} is not an electric vehicle.`);
    }

    return null;
}

export const setEngineAction = async (id: number, action: SmartcarEngineAction): Promise<EngineActionStatus|null> => {
    const command = action === SmartcarEngineAction.START ? GMEngineAction.START_VEHICLE : GMEngineAction.STOP_VEHICLE;
    const request = {
        ...gmRequest,
        id,
        command
    };

    const res = await axios.post(`${url}/actionEngineService`, request);

    if(res.data.status === '200') {
        const status = res.data.actionResult.status;
        
        return {
            status: status === GMEngineActionStatus.EXECUTED ? 
                SmartcarEngineActionStatus.SUCCESS : SmartcarEngineActionStatus.ERROR
        }
    }

    return null;
}

const getEnergyLevel = async (id: number): Promise<EnergyLevel|null> => {
    const request = {
        ...gmRequest,
        id
    };

    const res = await axios.post(`${url}/getEnergyService`, request);

    if(res.data.status === '200') {
        return mapToEnergyLevel(res.data.data);
    }

    return null;
}
