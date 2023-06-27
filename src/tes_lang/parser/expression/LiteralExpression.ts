import Expression from './Expression'
import Visitor from './Visitor'

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
