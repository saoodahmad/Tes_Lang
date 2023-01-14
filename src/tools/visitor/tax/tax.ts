import Book from '../Entities/Book'
import Pen from '../Entities/Pen'
import Visitor from './Vistor'

class Calculator extends Visitor {
    cart: [Pen, Book]

    constructor() {
        super()
        this.cart = [new Pen(20), new Book(20)]
    }

    calculate(): number {
        let tax = 0

        this.cart.map((item) => {
            tax += item.accept(this)
            return tax
        }, tax)

        return tax
    }
}

const calc = new Calculator()

console.log(calc.calculate())
