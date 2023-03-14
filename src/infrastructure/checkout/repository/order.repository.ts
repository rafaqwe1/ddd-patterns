import Order from "../../../domain/checkout/entity/order"
import OrderModel from "../repository/sequelize/model/order.model";
import OrderItemModel from "../repository/sequelize/model/order-item.model";
import OrderRepositoryInterface from "../../../domain/checkout/repository/order-repository.interface";
import OrderItem from "../../../domain/checkout/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity
            }))
        },
            {
                include: [{ model: OrderItemModel }]
            }
        )
    }

    async update(entity: Order): Promise<void> {
        const orderModel = await OrderModel.findOne({ where: { id: entity.id }, include: [{ model: OrderItemModel }] })

        if(orderModel === null){
            return
        }

        orderModel.total = entity.total()
        orderModel.customer_id = entity.customerId

        await Promise.all(orderModel.items.map(async item => await item.destroy()))
        await Promise.all(entity.items.map(async item => await OrderItemModel.create({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
            order_id: entity.id
        })))

        await orderModel.save()
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({ where: { id }, include: [{ model: OrderItemModel }] })
        
        const items = orderModel.items.map(item => {
            return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
        })

        return new Order(orderModel.id, orderModel.customer_id, items)
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({ include: [{ model: OrderItemModel }] })
        return orderModels.map(order => {
            const items = order.items.map(item => {
                return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
            })
            return new Order(order.id, order.customer_id, items)
        })
    }
}