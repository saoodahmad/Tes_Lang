import Token from '../../lexer/Token'
import Visitor from '../declaration/Visitor'
import Expression from './Expression'

export default class CallExpression extends Expression {
    callee: Expression

    // closing parantheses
    parenthesis: Token

    callArguments: Expression[]

    constructor(
        callee: Expression,
        paranthesis: Token,
        callArguments: Expression[]
    ) {
        super()
        this.callee = callee
        this.parenthesis = paranthesis
        this.callArguments = callArguments
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitCallExpression(this)
    }
}
