import Address from "../entity/address"
import EventDispatcher from "../event/@shared/event-dispatcher"
import EnviaConsoleLog1 from "../event/customer/handler/envia-console-1.handler"
import EnviaConsoleLog2 from "../event/customer/handler/envia-console-2.handler"
import CustomerService from "./customer.service"
describe("Customer service unit tests", () => {
    it("should create a customer and notify all the events", () => {
        const eventDispatcher = new EventDispatcher()
    
        const customerCreatedEvent = new EnviaConsoleLog1()
        const spyCustomerCreated = jest.spyOn(customerCreatedEvent, "handle")

        eventDispatcher.register("CustomerCreatedEvent", customerCreatedEvent)
        
        const service = new CustomerService(eventDispatcher)

        service.create("1", "customer 1")
        expect(spyCustomerCreated).toHaveBeenCalled()     
    })

    it("should change a customer address and notify all the events", () => {
        const eventDispatcher = new EventDispatcher()

        const addressChangedEvent = new EnviaConsoleLog2()
        const spyAddressChanged = jest.spyOn(addressChangedEvent, "handle")

        eventDispatcher.register("CustomerAddressChangedEvent", addressChangedEvent)
        
        const service = new CustomerService(eventDispatcher)
        const customer = service.create("1", "customer 1")
        
        service.changeAddress(customer, new Address("1", 1, "123", "test"))

        expect(spyAddressChanged).toHaveBeenCalled()        
    })

})