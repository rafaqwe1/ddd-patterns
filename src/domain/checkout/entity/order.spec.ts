import Order from "./order"
import OrderItem from "./order_item"

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      new Order("", "rafael", [])
    }).toThrowError("Id is required")
  })

  it("should throw error when CustomerId is empty", () => {
    expect(() => {
      new Order("123", "", [])
    }).toThrowError("CustomerId is required")
  })

  it("should throw error when items is empty", () => {
    expect(() => {
      new Order("123", "123", [])
    }).toThrowError("Items are required")
  })

  it("should calculate total", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2)
    const order = new Order("1", "1", [item])
    let total = order.total()
    expect(total).toBe(200)

    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order2 = new Order("1", "1", [item, item2])

    total = order2.total()

    expect(total).toBe(600)
  })

  it("should throw error if the item quantity is less or equal 0", () => {

    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 0)
      const order = new Order("1", "1", [item])
      order.total()
    }).toThrowError("Quantity must be greater then 0")
  })

})