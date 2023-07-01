import Visitor from '../declaration/Visitor'
import Expression from '../expression/Expression'
import Statement from './Statement'

export default class WhileStatment extends Statement {
    condition: Expression

    body: Statement

    constructor(condition: Expression, body: Statement) {
        super()
        this.condition = condition
        this.body = body
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitWhileStatement(this)
    }
}
