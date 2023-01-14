import Visitor from '../tax/Vistor'
import Item from './item'

export default class Book implements Item {
    price: number

    constructor(price: number) {
        this.price = price
    }

    getPrice(): number {
        return this.price
    }

    accept(visitor: Visitor): number {
        return visitor.visitBook(this)
    }
}
