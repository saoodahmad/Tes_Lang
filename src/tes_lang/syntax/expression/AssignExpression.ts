import Token from '../../lexer/Token'
import Visitor from '../declaration/Visitor'
import Expression from './Expression'

export default class AssignExpression extends Expression {
    name: Token

    value: Expression

    constructor(name: Token, value: Expression) {
        super()
        this.name = name
        this.value = value
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitAssignExpression(this)
    }
}
