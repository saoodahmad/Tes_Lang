import Token from '../../lexer/Token'
import Expression from './Expression'
import Visitor from './Visitor'

export default class UnaryExpression extends Expression {
    operator: Token

    right: Expression

    constructor(operator: Token, right: Expression) {
        super()
        this.operator = operator
        this.right = right
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitUnaryExpression(this)
    }
}
