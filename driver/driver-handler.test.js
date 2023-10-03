/*
As a driver, I want to be notified when there is a package to be delivered.
As a driver, I want to alert the system when I have picked up a package and it is in transit.
As a driver, I want to alert the system when a package has been delivered.
*/

const { Driver } = require('./index.js');
const eventPool = require('../eventPool');
const { respondToPickup, createDelivered } = require('./handler');

jest.mock('../eventPool');
const orderDetails = {
    address: 'Kansas City, MO',
    customer: 'Roy Jackson',
    orderId: 'AB123345',
    store: "JB's Awesome Swag",
}

describe('Driver should be able to listen for Pickup events, and emit in-transit event to the Hub', () => {
    test('Should listen for Pickup events', () => {    
        const myDriver = new Driver('Jean-Baptiste Blameux');
        eventPool.on = jest.fn();

        myDriver.listenForPickup(orderDetails);
        expect(eventPool.on).toHaveBeenCalledWith('pickup', respondToPickup(orderDetails));
    })
    test('Should emit an in-transit event to the Hub with order payload', () => {
        eventPool.emit = jest.fn();

        respondToPickup(orderDetails);
        expect(eventPool.emit).toHaveBeenCalledWith('in-transit', orderDetails);
    })
})

describe('Driver should be able to initiate Delivered events', () => {
    test('Should emit Delivered event to Hub', () => {
        const myDriver = new Driver('Jean-Baptiste Blameux');
        eventPool.on = jest.fn();

        myDriver.emitDelivered(orderDetails);
        expect(eventPool.emit).toHaveBeenCalledWith('delivered', createDelivered(orderDetails));
    })
})
