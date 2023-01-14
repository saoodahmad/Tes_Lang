import Book from '../Entities/Book'
import Pen from '../Entities/Pen'

export default class Visitor {
    visitBook(item: Book): number {
        return item.getPrice() * 0.1
    }

    visitPen(item: Pen): number {
        return item.getPrice() * 0.1
    }
}
