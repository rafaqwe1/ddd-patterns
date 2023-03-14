import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../customer/repository/sequelize/model/customer.model";
import OrderItemModel from "../../checkout/repository/sequelize/model/order-item.model";
import ProductModel from "../../product/repository/sequelize/model/product.model";
import OrderModel from "../../checkout/repository/sequelize/model/order.model";
import CustomerRepository from "../../customer/repository/customer.repository"
import ProductRepository from "../../product/repository/product.repository"
import OrderRepository from "../../checkout/repository/order.repository"
import Order from "../../../domain/checkout/entity/order"
import OrderItem from "../../../domain/checkout/entity/order_item"
import Product from "../../../domain/product/entity/product"
import Customer from "../../../domain/customer/entity/customer"
import Address from "../../../domain/customer/value-object/address"

describe("Order repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([OrderModel, CustomerModel, OrderItemModel, ProductModel])
        await sequelize.sync()

    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("123", "Customer 1")
        const address = new Address("street 1", 1, "Zipcode 1", "City 1")
        customer.Address = address
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("123", "Product 1", 10)
        await productRepository.create(product)

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        )

        const order = new Order("123", "123", [orderItem])

        const orderRepository = new OrderRepository()
        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne(
            {
                where: {
                    id: order.id
                },
                include: ["items"]
            },
        )

        expect(orderModel?.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    product_id: orderItem.productId,
                    order_id: "123"
                }
            ]
        })
    })

    it("should find a order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("123", "Customer 1")
        const address = new Address("street 1", 1, "Zipcode 1", "City 1")
        customer.Address = address
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("123", "Product 1", 10)
        await productRepository.create(product)

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        )

        const order = new Order("123", "123", [orderItem])

        const orderRepository = new OrderRepository()
        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne(
            {
                where: {
                    id: order.id
                },
                include: ["items"]
            },
        )

        const foundOrder = await orderRepository.find(order.id)

        expect(orderModel?.toJSON()).toStrictEqual({
            id: foundOrder.id,
            customer_id: order.customerId,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    product_id: orderItem.productId,
                    quantity: orderItem.quantity,
                    order_id: order.id
                }
            ],
        })
    })

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("123", "Customer 1")
        const address = new Address("street 1", 1, "Zipcode 1", "City 1")
        customer.Address = address
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("123", "Product 1", 10)
        await productRepository.create(product)

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        )

        const order = new Order("123", "123", [orderItem])

        const orderItem2 = new OrderItem(
            "2",
            product.name,
            product.price,
            product.id,
            2
        )
        const order2 = new Order("124", "123", [orderItem2])

        const orderRepository = new OrderRepository()
        
        await orderRepository.create(order)
        await orderRepository.create(order2)

        const orders = [order, order2]

        const foundOrders = await orderRepository.findAll()

        expect(foundOrders).toEqual(orders)
    })

    it("should update a order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("123", "Customer 1")
        const address = new Address("street 1", 1, "Zipcode 1", "City 1")
        customer.Address = address
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("123", "Product 1", 10)
        await productRepository.create(product)

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        )

        const order = new Order("123", "123", [orderItem])

        const orderRepository = new OrderRepository()
        await orderRepository.create(order)
        
        const updatedOrderItem = new OrderItem(
            "1",
            product.name,
            20,
            product.id,
            2
        )
        const updatedOrder = new Order("123", "123", [updatedOrderItem])
        await orderRepository.update(updatedOrder)

        const foundOrder = await OrderModel.findOne({ where: { id: "123" }, include: [{ model: OrderItemModel }] })

        expect(foundOrder?.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: order.customerId,
            total: updatedOrder.total(),
            items: [
                {
                    id: updatedOrderItem.id,
                    name: updatedOrderItem.name,
                    price: updatedOrderItem.price,
                    product_id: updatedOrderItem.productId,
                    quantity: updatedOrderItem.quantity,
                    order_id: order.id
                }
            ],
        })
    })

})