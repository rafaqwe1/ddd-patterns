import Address from "../entity/address"
import Customer from "../entity/customer"
import EventDispatcherInterface from "../event/@shared/event-dispatcher.interface"
import CustomerAddressChangedEvent from "../event/customer/customer-address-changed.event"
import CustomerCreatedEvent from "../event/customer/customer-created.event"

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