import Visitor from './Visitor'

export default abstract class Expression {
    abstract accept<T>(visitor: Visitor<T>): T
}
