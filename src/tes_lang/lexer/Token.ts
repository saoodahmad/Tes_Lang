import { TypeTokenKind } from './TokenType.enum'

export default class Token {
    readonly type: TypeTokenKind

    readonly lexeme: string

    readonly literal: unknown

    readonly line: number

    constructor(
        type: TypeTokenKind,
        lexeme: string,
        literal: unknown,
        line: number
    ) {
        this.type = type
        this.lexeme = lexeme
        this.literal = literal
        this.line = line
    }

    toString(): string {
        return `Type: ${this.type},  Lexeme: '${this.lexeme}',  Literal: ${this.literal}`
    }
}
