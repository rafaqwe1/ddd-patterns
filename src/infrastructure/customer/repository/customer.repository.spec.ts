import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../repository/sequelize/model/customer.model";
import Customer from "../../../domain/customer/entity/customer"
import CustomerRepository from "./customer.repository"
import Address from "../../../domain/customer/value-object/address";

describe("Customer repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([CustomerModel])
        await sequelize.sync()

    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "Customer 1")
        customer.Address = new Address("1", 1, "11", "c")

        await customerRepository.create(customer)

        const customerModel = await CustomerModel.findOne({ where: { id: "1" } })

        expect(customerModel?.toJSON()).toStrictEqual({
            id: "1",
            name: "Customer 1",
            street: "1",
            number: 1,
            zipcode: "11",
            city: "c",
            rewardPoints: 0,
            active: false
        })
    })

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "Customer 1")
        customer.Address = new Address("1", 1, "11", "c")

        await customerRepository.create(customer)

        customer.changeName("Customer 2")

        await customerRepository.update(customer)

        const customerModel2 = await CustomerModel.findOne({ where: { id: "1" } })

        expect(customerModel2?.toJSON()).toStrictEqual({
            id: "1",
            name: "Customer 2",
            street: "1",
            number: 1,
            zipcode: "11",
            city: "c",
            rewardPoints: 0,
            active: false
        })
    })

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "Customer 1")
        customer.Address = new Address("1", 1, "11", "c")
        await customerRepository.create(customer)

        const customerModel = await CustomerModel.findOne({ where: { id: "1" } })
        const foundCustomer = await customerRepository.find("1")

        expect(customerModel?.toJSON()).toStrictEqual({
            id: foundCustomer.id,
            name: "Customer 1",
            street: "1",
            number: 1,
            zipcode: "11",
            city: "c",
            rewardPoints: 0,
            active: false
        })
    })

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "Customer 1")
        customer.Address = new Address("1", 1, "11", "c")

        await customerRepository.create(customer)

        const customer2 = new Customer("2", "Customer 2")
        customer2.Address = new Address("1", 1, "11", "c")
        await customerRepository.create(customer2)

        const foundCustomers = await customerRepository.findAll()
        const customers = [customer, customer2]

        expect(foundCustomers).toEqual(customers)

    })

})