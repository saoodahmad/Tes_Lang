import Visitor from '../declaration/Visitor'
import Statement from './Statement'

export default class BreakStatement extends Statement {
    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitBreakStatement(this)
    }
}
