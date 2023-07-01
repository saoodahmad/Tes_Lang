import Visitor from '../declaration/Visitor'
import Expression from '../expression/Expression'

import Statement from './Statement'

export default class ForStatment extends Statement {
    intializer: Statement

    condition: Expression

    increment: Expression

    body: Statement

    constructor(
        intializer: Statement,
        condition: Expression,
        increment: Expression,
        body: Statement
    ) {
        super()
        this.intializer = intializer
        this.condition = condition
        this.increment = increment
        this.body = body
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitForStatement(this)
    }
}
