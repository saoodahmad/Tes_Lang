import Token from '../../lexer/Token'
import Expression from '../expression/Expression'
import Declaration from './Declaration'
import Visitor from './Visitor'

export default class VariableDeclaration extends Declaration {
    name: Token

    initializer: Expression

    constructor(name: Token, initializer: Expression) {
        super()
        this.name = name
        this.initializer = initializer
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitVariableDeclaration(this)
    }
}
