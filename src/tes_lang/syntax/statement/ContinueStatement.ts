import Visitor from '../declaration/Visitor'
import Statement from './Statement'

export default class ContinueStatement extends Statement {
    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitContinueStatement(this)
    }
}
