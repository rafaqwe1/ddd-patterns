import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface"
import Customer from "../entity/customer"
import CustomerAddressChangedEvent from "../event/customer-address-changed.event"
import CustomerCreatedEvent from "../event/customer-created.event"
import Address from "../value-object/address"

export default class CustomerService {
    
    private eventDispatcher: EventDispatcherInterface

    constructor(eventDispatcher: EventDispatcherInterface){
        this.eventDispatcher = eventDispatcher
    }

    create(id: string, name: string): Customer {
        const customer = new Customer(id, name)
        this.eventDispatcher.notify(new CustomerCreatedEvent({}))
        return customer
    }

    changeAddress(customer: Customer, address: Address){
        customer.Address = address
        this.eventDispatcher.notify(new CustomerAddressChangedEvent({customer}))
    }
}