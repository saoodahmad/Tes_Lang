import TLang from '../TLang'
import Token from './Token'
import { TokenKind } from './TokenType.enum'

class Lexer {
    sourceCode: string

    tokens: Array<Token> = []

    start = 0

    current = 0

    line = 1

    constructor(sourceCode: string) {
        this.sourceCode = sourceCode
    }

    lex(): Array<Token> {
        while (!this.isAtEnd()) {
            this.start = this.current
            this.scanToken()
        }

        this.tokens.push(new Token(TokenKind.EOF, '', null, this.line))
        return this.tokens
    }

    isAtEnd(): boolean {
        return this.current >= this.sourceCode.length
    }

    scanToken() {
        const c = this.advance()

        switch (c) {
            case '(':
                this.addToken(TokenKind.LEFT_PAREN)
                break
            case ')':
                this.addToken(TokenKind.RIGHT_PAREN)
                break
            case '{':
                this.addToken(TokenKind.LEFT_BRACE)
                break
            case '}':
                this.addToken(TokenKind.RIGHT_BRACE)
                break
            default:
                TLang.error(this.line, `Unexpected character '${c}'`)
        }
    }

    advance(): string {
        return this.sourceCode.charAt(this.current++)
    }

    addToken(type: TokenKind): void {
        return this.addTokenWithLiteral(type, null)
    }

    addTokenWithLiteral(type: TokenKind, literal: object): void {
        const text = this.sourceCode.substring(this.start, this.current)
        this.tokens.push(new Token(type, text, literal, this.line))
    }
}

export default Lexer
