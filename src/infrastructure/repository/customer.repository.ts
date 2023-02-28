import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer"
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zipcode,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
        })
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update({
            name: entity.name,
        }, {
            where: {
                id: entity.id
            }
        })
    }

    async find(id: string): Promise<Customer> {
        const customerModel = await CustomerModel.findOne({ where: { id } })
        const customer = new Customer(customerModel.id, customerModel.name)
        customer.Address = new Address(customerModel.street, customerModel.number, customerModel.zipcode, customerModel.city)
        if(customerModel.active == true){
            customer.activate()
        }
        customer.addRewardPoints(customerModel.rewardPoints)
        return customer
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll()
        return customerModels.map(customerModel => {
            const customer = new Customer(customerModel.id, customerModel.name)
            customer.Address = new Address(customerModel.street, customerModel.number, customerModel.zipcode, customerModel.city)
            customer.addRewardPoints(customerModel.rewardPoints)
            if(customerModel.active == true){
                customer.activate()
            }
            return customer
        })
    }

}