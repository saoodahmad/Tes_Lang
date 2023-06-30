import Expression from './Expression'
import Visitor from '../declaration/Visitor'

export default class LiteralExpression extends Expression {
    value: any

    constructor(value: any) {
        super()
        this.value = value
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitLiteralExpression(this)
    }
}
