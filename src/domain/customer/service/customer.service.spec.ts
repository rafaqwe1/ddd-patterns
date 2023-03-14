import Address from "../value-object/address"
import EventDispatcher from "../../@shared/event/event-dispatcher"
import EnviaConsoleLogHandler from "../event/handler/envia-console-log.handler"
import EnviaConsoleLog1Handler from "../event/handler/envia-console-log-1.handler"
import EnviaConsoleLog2Handler from "../event/handler/envia-console-log-2.handler"
import CustomerService from "./customer.service"
describe("Customer service unit tests", () => {
    it("should create a customer and notify all the events", () => {
        const eventDispatcher = new EventDispatcher()
    
        const customerCreatedEvent1 = new EnviaConsoleLog1Handler()
        const spyCustomerCreated1 = jest.spyOn(customerCreatedEvent1, "handle")

        const customerCreatedEvent2 = new EnviaConsoleLog2Handler()
        const spyCustomerCreated2 = jest.spyOn(customerCreatedEvent2, "handle")

        eventDispatcher.register("CustomerCreatedEvent", customerCreatedEvent1)
        eventDispatcher.register("CustomerCreatedEvent", customerCreatedEvent2)
        
        const service = new CustomerService(eventDispatcher)

        service.create("1", "customer 1")
        expect(spyCustomerCreated1).toHaveBeenCalled()     
        expect(spyCustomerCreated2).toHaveBeenCalled()     
    })

    it("should change a customer address and notify all the events", () => {
        const eventDispatcher = new EventDispatcher()

        const addressChangedEvent = new EnviaConsoleLogHandler()
        const spyAddressChanged = jest.spyOn(addressChangedEvent, "handle")

        eventDispatcher.register("CustomerAddressChangedEvent", addressChangedEvent)
        
        const service = new CustomerService(eventDispatcher)
        const customer = service.create("1", "customer 1")
        
        service.changeAddress(customer, new Address("1", 1, "123", "test"))

        expect(spyAddressChanged).toHaveBeenCalled()        
    })

})