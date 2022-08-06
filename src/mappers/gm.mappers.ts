import EnergyLevel from "../models/energy-level.model";
import EnergyPercentage from "../models/energy-percentage.model";
import SecurityStatus from "../models/security-status.model";
import Vehicle from "../models/vehicle.model";

/* Based on the documentation, I made the assumption here that if
a car is not a 4 door sedan then it must have 2 doors. I also assume
that the data from GM Api is valid so I am not validating it. In the real world,
I would do more thorough validation such as checking if 'fourDoorSedan' is false
then 'twoDoorCoupe' is indeed true or checking that tank/battery levels are valid numbers.
*/
export const mapToVehicle = (gmResponse: any): Vehicle => {
    const vehicle: Vehicle = {
            vin: gmResponse.vin.value,
            color: gmResponse.color.value,
            doorCount: gmResponse.fourDoorSedan.value === 'True' ? 4 : 2,
            driveTrain: gmResponse.driveTrain.value
        };

    return vehicle;
}

export const mapToSecurityStatus = (gmResponse: any): SecurityStatus[] => {
    const security: SecurityStatus[] = gmResponse.doors.values.map((v: any) => {
        return {
            location: v.location.value,
            locked: v.locked.value === 'True'
        }
    });

    return security;
}

export const mapToEnergyLevel = (gmResponse: any): EnergyLevel => {
    console.log('gm energy resp', gmResponse)
    const tankLevel = gmResponse.tankLevel.value;
    const batteryLevel = gmResponse.batteryLevel.value;

    const energy: EnergyLevel = {
        tank: tankLevel === 'null' ? null : +tankLevel,
        battery: batteryLevel === 'null' ? null : +batteryLevel,
    };

    return energy;
}
