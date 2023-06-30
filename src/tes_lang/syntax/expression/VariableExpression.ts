import Token from '../../lexer/Token'
import Visitor from '../declaration/Visitor'
import Expression from './Expression'

export default class VariableExpression extends Expression {
    name: Token

    constructor(name: Token) {
        super()
        this.name = name
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitVariableExpression(this)
    }
}
