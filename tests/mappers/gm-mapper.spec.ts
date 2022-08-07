import { faker } from '@faker-js/faker';
import * as mappers from '../../src/mappers/gm-mapper';
import EnergyLevel from '../../src/models/energy-level.model';
import SecurityStatus from '../../src/models/security-status.model';
import Vehicle from '../../src/models/vehicle.model';

describe('GM mapper', () => {
    it('should map to Vehicle', () => {
        // Arrange
        const fakeVin = faker.random.word();
        const fakeColor = faker.random.word();
        const fakeFourDoor = 'True';
        const fakeTwoDoor = 'False';
        const fakeDriveTrain = faker.random.word();

        const fakeGmResponse = {
            vin: {
                type: faker.random.word(),
                value: fakeVin,
            },
            color: {
                type: faker.random.word(),
                value: fakeColor,
            },
            fourDoorSedan: {
                type: faker.random.word(),
                value: fakeFourDoor,
            },
            twoDoorCoupe: {
                type: faker.random.word(),
                value: fakeTwoDoor,
            },
            driveTrain: {
                type: faker.random.word(),
                value: fakeDriveTrain,
            }
        };

        const expectedVehicle: Vehicle = {
            vin: fakeVin,
            color: fakeColor,
            doorCount: 4,
            driveTrain: fakeDriveTrain
        };

        // Act
        const vehicle = mappers.mapToVehicle(fakeGmResponse)

        // Assert
        expect(vehicle).toEqual(expectedVehicle);
    });

    it('should map to SecurityStatus', () => {
        // Arrange
        const fakeLocation1 = faker.random.word();
        const fakeLocked1 = 'True';

        const fakeLocation2 = faker.random.word();
        const fakeLocked2 = 'False';

        const fakeGmResponse = {
            doors: {
                type: faker.random.word(),
                values: [
                    {
                        location: {
                            type: faker.random.word(),
                            value: fakeLocation1
                        },
                        locked: {
                            type:faker.random.word(),
                            value: fakeLocked1
                        }
                    },
                    {
                        location: {
                            type: faker.random.word(),
                            value: fakeLocation2
                        },
                        locked: {
                            type:faker.random.word(),
                            value: fakeLocked2
                        }
                    }
                ]
            }
        };

        const expectedSecurityStatus: SecurityStatus[] = [
            {
                location: fakeLocation1,
                locked: true
            },
            {
                location: fakeLocation2,
                locked: false
            }
        ];

        // Act
        const securityStatus = mappers.mapToSecurityStatus(fakeGmResponse);

        // Assert
        expect(securityStatus).toEqual(expectedSecurityStatus);
    });

    it('should map to EnergyLevel', () => {
        // Arrange
        const fakeTankLevel = faker.random.numeric();
        const fakeBatteryLevel = 'null';

        const fakeGmResponse = {
            tankLevel: {
                type: faker.random.word(),
                value: fakeTankLevel
            },
            batteryLevel: {
                type: faker.random.word(),
                value: fakeBatteryLevel
            }
        };

        const expectedEnergyLevel: EnergyLevel = {
            tank: +fakeTankLevel,
            battery: null
        };

        // Act
        const energyLevel = mappers.mapToEnergyLevel(fakeGmResponse);

        // Assert
        expect(energyLevel).toEqual(expectedEnergyLevel);
    });
});