import Declaration from '../declaration/Declaration'
import Visitor from '../declaration/Visitor'
import Statement from './Statement'

export default class BlockStatement extends Statement {
    declarations: Declaration[]

    constructor(declarations: Declaration[]) {
        super()
        this.declarations = declarations
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitBlockStatement(this)
    }
}
