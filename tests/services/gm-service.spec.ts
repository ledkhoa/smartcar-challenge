import { faker } from '@faker-js/faker';

const mockConfig = {
  GM_SERVICE_URL: faker.random.word(),
};

jest.mock('../../src/config', () => mockConfig);

import * as GMService from '../../src/services/gm-service';
import * as mappers from '../../src/mappers/gm.mappers';
import axios from 'axios';
import Vehicle from '../../src/models/vehicle.model';
import SecurityStatus from '../../src/models/security-status.model';
import EnergyLevel from '../../src/models/energy-level.model';
import EnergyPercentage from '../../src/models/energy-percentage.model';
import { SmartcarEngineActionStatus } from '../../src/enums/smartcar-engine-action-status.enum';
import { SmartcarEngineAction } from '../../src/enums/smartcar-engine-action.enum';
import { GMEngineAction } from '../../src/enums/gm-engine-action.enum';
import EngineActionStatus from '../../src/models/engine-action-status.model';

describe('GM Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get vehicle', () => {
        it('should return vehicle', async () => {
            // Arrange
            const id = faker.datatype.number();
            
            const fakeRequest = {
                id,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '200'
                }
            };
            
            const expectedVehicle: Vehicle = {
                vin: faker.random.alphaNumeric(),
                color: faker.random.word(),
                doorCount: faker.datatype.number(),
                driveTrain: faker.random.alphaNumeric()
            };
            
            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            const mapperSpy = jest.spyOn(mappers, 'mapToVehicle').mockImplementationOnce(() => expectedVehicle);
            
            // Act
            const res = await GMService.getVehicleInfo(id);
            
            // Assert
            expect(res).toEqual(expectedVehicle);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/getVehicleInfoService`, fakeRequest)
            expect(mapperSpy).toHaveBeenCalled();
        });
        
        it('should return null if vehicle is not found', async () => {
            // Arrange
            const id = faker.datatype.number();
            
            const fakeRequest = {
                id,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '404'
                }
            };
            
            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            const mapperSpy = jest.spyOn(mappers, 'mapToVehicle');
            
            // Act
            const res = await GMService.getVehicleInfo(id);
            
            // Assert
            expect(res).toBe(null);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/getVehicleInfoService`, fakeRequest)
            expect(mapperSpy).not.toHaveBeenCalled();
        });
    });

    describe('get security status', () => {
        it('should return security status', async () => {
            // Arrange
            const id = faker.datatype.number();
            
            const fakeRequest = {
                id,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '200'
                }
            };

            const expectedSecurityStatus: SecurityStatus[] = [
                {
                    location: faker.random.word(),
                    locked: faker.datatype.boolean()
                },
                {
                    location: faker.random.word(),
                    locked: faker.datatype.boolean()
                },
            ];
            
            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            const mapperSpy = jest.spyOn(mappers, 'mapToSecurityStatus').mockImplementationOnce(() => expectedSecurityStatus);
            
            // Act
            const res = await GMService.getSecurityStatus(id);
            
            // Assert
            expect(res).toBe(expectedSecurityStatus);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/getSecurityStatusService`, fakeRequest)
            expect(mapperSpy).toHaveBeenCalled();
        });

        it('should return null if vehicle is not found', async () => {
            // Arrange
            const id = faker.datatype.number();
            
            const fakeRequest = {
                id,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '404'
                }
            };
            
            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            const mapperSpy = jest.spyOn(mappers, 'mapToSecurityStatus');
            
            // Act
            const res = await GMService.getSecurityStatus(id);
            
            // Assert
            expect(res).toBe(null);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/getSecurityStatusService`, fakeRequest)
            expect(mapperSpy).not.toHaveBeenCalled();
        });
    });

    describe('get fuel', () => {
        it('should get fuel range', async () => {
            // Arrange
            const id = faker.datatype.number();
            
            const fakeRequest = {
                id,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '200'
                }
            };

            const fakeFuel = faker.datatype.number();
            const fakeEnergyLevel: EnergyLevel = {
                tank: fakeFuel,
                battery: null
            };

            const expectedFuel: EnergyPercentage = {
                percent: fakeFuel
            };
            
            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            const mapperSpy = jest.spyOn(mappers, 'mapToEnergyLevel').mockImplementationOnce(() => fakeEnergyLevel);
            
            // Act
            const res = await GMService.getFuel(id);
            
            // Assert
            expect(res).toStrictEqual(expectedFuel);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/getEnergyService`, fakeRequest)
            expect(mapperSpy).toHaveBeenCalled();
        });

        it('should return null if vehicle is not found', async () => {
            // Arrange
            const id = faker.datatype.number();
            
            const fakeRequest = {
                id,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '404'
                }
            };
            
            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            const mapperSpy = jest.spyOn(mappers, 'mapToEnergyLevel');
            
            // Act
            const res = await GMService.getFuel(id);
            
            // Assert
            expect(res).toStrictEqual(null);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/getEnergyService`, fakeRequest)
            expect(mapperSpy).not.toHaveBeenCalled();
        });

        it('should throw error if vehicle is not gas', async () => {
            // Arrange
            const id = faker.datatype.number();
            
            const fakeRequest = {
                id,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '200'
                }
            };

            const fakeBattery = faker.datatype.number();
            const fakeEnergyLevel: EnergyLevel = {
                tank: null,
                battery: fakeBattery
            };

            const expectedError = `Vehicle id ${id} is not a gas vehicle.`
            let receivedError;
            
            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            const mapperSpy = jest.spyOn(mappers, 'mapToEnergyLevel').mockImplementationOnce(() => fakeEnergyLevel);
            
            // Act
            try {
                await GMService.getFuel(id);
            } catch(e: any) {
                receivedError = e.message;
            }

            // Assert
            expect(receivedError).toBe(expectedError);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/getEnergyService`, fakeRequest)
            expect(mapperSpy).toHaveBeenCalled();
        });
    });

    describe('get battery', () => {
        it('should get battery range', async () => {
            // Arrange
            const id = faker.datatype.number();
            
            const fakeRequest = {
                id,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '200'
                }
            };

            const fakeBattery = faker.datatype.number();
            const fakeEnergyLevel: EnergyLevel = {
                tank: null,
                battery: fakeBattery
            };

            const expectedBattery: EnergyPercentage = {
                percent: fakeBattery
            };
            
            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            const mapperSpy = jest.spyOn(mappers, 'mapToEnergyLevel').mockImplementationOnce(() => fakeEnergyLevel);
            
            // Act
            const res = await GMService.getBattery(id);
            
            // Assert
            expect(res).toStrictEqual(expectedBattery);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/getEnergyService`, fakeRequest)
            expect(mapperSpy).toHaveBeenCalled();
        });

        it('should return null if vehicle is not found', async () => {
            // Arrange
            const id = faker.datatype.number();
            
            const fakeRequest = {
                id,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '404'
                }
            };
            
            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            const mapperSpy = jest.spyOn(mappers, 'mapToEnergyLevel');
            
            // Act
            const res = await GMService.getBattery(id);
            
            // Assert
            expect(res).toStrictEqual(null);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/getEnergyService`, fakeRequest)
            expect(mapperSpy).not.toHaveBeenCalled();
        });

        it('should throw error if vehicle is not electric', async () => {
            // Arrange
            const id = faker.datatype.number();
            
            const fakeRequest = {
                id,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '200'
                }
            };

            const fakeFuel = faker.datatype.number();
            const fakeEnergyLevel: EnergyLevel = {
                tank: fakeFuel,
                battery: null
            };

            const expectedError = `Vehicle id ${id} is not an electric vehicle.`
            let receivedError;
            
            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            const mapperSpy = jest.spyOn(mappers, 'mapToEnergyLevel').mockImplementationOnce(() => fakeEnergyLevel);
            
            // Act
            try {
                await GMService.getBattery(id);
            } catch(e: any) {
                receivedError = e.message;
            }

            // Assert
            expect(receivedError).toBe(expectedError);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/getEnergyService`, fakeRequest)
            expect(mapperSpy).toHaveBeenCalled();
        });
    });

    describe('set engine action', () => {
        it('should start vehicle', async () => {
            // Arrange
            const id = faker.datatype.number();
            const action = SmartcarEngineAction.START;

            const command = GMEngineAction.START_VEHICLE;
            
            const fakeRequest = {
                id,
                command,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '200',
                    actionResult: {
                        status: 'EXECUTED'
                    }
                }
            };
            
            const expectedResult: EngineActionStatus = {
                status: SmartcarEngineActionStatus.SUCCESS
            };

            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            
            // Act
            const res = await GMService.setEngineAction(id, action);
            
            // Assert
            expect(res).toEqual(expectedResult);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/actionEngineService`, fakeRequest)
        });

        it('should fail to stop vehicle', async () => {
            // Arrange
            const id = faker.datatype.number();
            const action = SmartcarEngineAction.STOP;

            const command = GMEngineAction.STOP_VEHICLE;
            
            const fakeRequest = {
                id,
                command,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '200',
                    actionResult: {
                        status: 'FAILED'
                    }
                }
            };
            
            const expectedResult: EngineActionStatus = {
                status: SmartcarEngineActionStatus.ERROR
            };
            
            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            
            // Act
            const res = await GMService.setEngineAction(id, action);
            
            // Assert
            expect(res).toEqual(expectedResult);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/actionEngineService`, fakeRequest)
        });

        it('should return null if vehicle is not found', async () => {
            // Arrange
            const id = faker.datatype.number();
            const action = SmartcarEngineAction.STOP;

            const command = GMEngineAction.STOP_VEHICLE;
            
            const fakeRequest = {
                id,
                command,
                responseType: "JSON"
            };
            
            const fakeGMResponse = {
                data: {
                    status: '404',
                }
            };
            const axiosSpy = jest.spyOn(axios, 'post').mockImplementationOnce((url, data) => Promise.resolve(fakeGMResponse));
            
            // Act
            const res = await GMService.setEngineAction(id, action);
            
            // Assert
            expect(res).toEqual(null);
            expect(axiosSpy).toHaveBeenCalledWith(`${mockConfig.GM_SERVICE_URL}/actionEngineService`, fakeRequest)
        });
    })
});
