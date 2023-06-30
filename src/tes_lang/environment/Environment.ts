import RuntimeError from '../interpreter/RuntimeError'
import Token from '../lexer/Token'

export default class Environment {
    readonly enclosing: Environment

    private readonly values = new Map<string, unknown>()

    constructor(enclosing: Environment = null) {
        this.enclosing = enclosing
    }

    get(name: Token) {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme)
        }

        if (this.enclosing != null) {
            return this.enclosing.get(name)
        }
        throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`)
    }

    assign(name: Token, value: unknown) {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value)
            return
        }

        if (this.enclosing != null) {
            this.enclosing.assign(name, value)
        }

        throw new RuntimeError(name, `Undefined variable '${name.lexeme}.'`)
    }

    defineVariable(name: Token, value: unknown) {
        this.define(name.lexeme, value)
    }

    define(key: string, value: unknown) {
        this.values.set(key, value)
    }
}
