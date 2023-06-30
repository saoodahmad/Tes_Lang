import Visitor from '../declaration/Visitor'
import Expression from '../expression/Expression'
import Statement from './Statement'

export default class IfStatement extends Statement {
    condition: Expression

    thenBranch: Statement

    elseBranch: Statement

    constructor(
        condition: Expression,
        thenBranch: Statement,
        elseBranch: Statement
    ) {
        super()
        this.condition = condition
        this.thenBranch = thenBranch
        this.elseBranch = elseBranch
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitIfStatement(this)
    }
}
