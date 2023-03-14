import Address from "../value-object/address"
import CustomerFactory from "./customer.factory"

describe("Customer factory unit tests", () => {

    it("should create a customer", () => {

        let customer = CustomerFactory.create("John")

        expect(customer.id).toBeDefined()
        expect(customer.name).toBe("John")
        expect(customer.address).toBeUndefined()
    })

    it("should create a customer with an address", () => {
        let address = new Address("street", 1, "zip", "city")
        let customer = CustomerFactory.createWithAddress("John", address)

        expect(customer.id).toBeDefined()
        expect(customer.name).toBe("John")
        expect(customer.address).toStrictEqual(address)
    })

})