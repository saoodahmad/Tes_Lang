import Token from '../../lexer/Token'
import Visitor from '../declaration/Visitor'
import Expression from './Expression'

export default class LogicalExpression extends Expression {
    left: Expression

    operator: Token

    right: Expression

    constructor(left: Expression, operator: Token, right: Expression) {
        super()
        this.left = left
        this.operator = operator
        this.right = right
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitLogicalExpression(this)
    }
}
