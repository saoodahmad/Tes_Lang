import Token from '../../lexer/Token'
import BlockStatement from '../statement/BlockStatement'
import Declaration from './Declaration'
import Visitor from './Visitor'

export default class FunctionDeclaration extends Declaration {
    name: Token

    formalArguments: Token[]

    body: BlockStatement

    constructor(name: Token, formalArguments: Token[], body: BlockStatement) {
        super()
        this.name = name
        this.formalArguments = formalArguments
        this.body = body
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitFunctionDeclaration(this)
    }
}
