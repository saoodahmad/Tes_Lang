import Token from '../../lexer/Token'
import Visitor from '../declaration/Visitor'
import Expression from '../expression/Expression'
import Statement from './Statement'

export default class ReturnStatement extends Statement {
    keyword: Token

    value: Expression

    constructor(keyword: Token, value: Expression) {
        super()
        this.keyword = keyword
        this.value = value
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitReturnStatement(this)
    }
}
