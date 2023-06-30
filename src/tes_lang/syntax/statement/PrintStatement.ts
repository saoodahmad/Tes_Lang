import Expression from '../expression/Expression'
import Statement from './Statement'
import Visitor from '../declaration/Visitor'

export default class PrintStatement extends Statement {
    expression: Expression

    constructor(expression: Expression) {
        super()
        this.expression = expression
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitPrintStatement(this)
    }
}
