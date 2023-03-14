import Address from "../value-object/address"
import Customer from './customer'

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "rafael")
    }).toThrowError("Id is required")
  })

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "")
    }).toThrowError("Name is required")
  })

  it("should change name", () => {
    // arrange
    const customer = new Customer("123", "Rafael")

    //act
    customer.changeName("Jane")

    //assert
    expect(customer.name).toBe("Jane")
  })

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1")
    const address = new Address("street 1", 123, "123123", "Goiania")
    customer.Address = address

    customer.activate()

    expect(customer.isActive()).toBe(true)
  })

  it("should throw error when address is undefined", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1")
      customer.activate()
    }).toThrowError("Address is mandatory to activate a customer")
  })

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1")
    const address = new Address("street 1", 123, "123123", "Goiania")
    customer.Address = address

    customer.activate()
    customer.deactivate()

    expect(customer.isActive()).toBe(false)
  })
})