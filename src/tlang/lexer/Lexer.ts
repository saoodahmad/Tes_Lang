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
        this.sourceCode = sourceCode.trim()
    }

    lex(): Array<Token> {
        // scan string and create tokens
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
            case ',':
                this.addToken(TokenKind.COMMA)
                break
            case '.':
                this.addToken(TokenKind.DOT)
                break
            case '-':
                this.addToken(TokenKind.MINUS)
                break
            case '+':
                this.addToken(TokenKind.PLUS)
                break
            case ';':
                this.addToken(TokenKind.SEMICOLON)
                break
            case '*':
                this.addToken(TokenKind.STAR)
                break
            // multi charcter token
            case '!':
                if (!this.isAtEnd()) {
                    this.addToken(
                        this.match('=') ? TokenKind.BANG_EQUAL : TokenKind.BANG
                    )
                } else {
                    this.addToken(TokenKind.BANG)
                }
                break
            case '=':
                if (!this.isAtEnd()) {
                    this.addToken(
                        this.match('=')
                            ? TokenKind.EQUAL_EQUAL
                            : TokenKind.EQUAL
                    )
                } else {
                    this.addToken(TokenKind.EQUAL)
                }
                break
            case '>':
                if (!this.isAtEnd()) {
                    this.addToken(
                        this.match('=')
                            ? TokenKind.GREATER_EQUAL
                            : TokenKind.GREATER
                    )
                } else {
                    this.addToken(TokenKind.GREATER)
                }
                break
            case '<':
                if (!this.isAtEnd()) {
                    this.addToken(
                        this.match('=') ? TokenKind.LESS_EQUAL : TokenKind.LESS
                    )
                } else {
                    this.addToken(TokenKind.LESS)
                }
                break
            case '/':
                if (!this.isAtEnd()) {
                    if (this.match('/')) {
                        while (this.peek() !== '\n' && !this.isAtEnd()) {
                            this.advance()
                        }
                        break
                    } else {
                        this.addToken(TokenKind.SLASH)
                        break
                    }
                } else {
                    this.addToken(TokenKind.SLASH)
                    break
                }

            case ' ':
            case '\t':
            case '\r':
                break

            case '\n':
                this.line++
                break

            case '"':
                this.string()
                break

            default:
                TLang.error(this.line, `Unexpected character '${c}'`)
                break
        }
    }

    match(expected: string): boolean {
        if (this.sourceCode.charAt(this.current) === expected) {
            this.current++
            return true
        }
        return false
    }

    peek(): string {
        if (this.isAtEnd()) {
            return '\n'
        }

        return this.sourceCode.charAt(this.current)
    }

    string(): void {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === '\n') this.line++
            this.advance()
        }
        if (this.peek() !== '"') {
            TLang.error(this.line, `Unterminated string`)
        }

        this.advance()

        const value = this.sourceCode.substring(
            this.start + 1,
            this.current - 1
        )
        this.addTokenWithLiteral(TokenKind.STRING, value)
    }

    advance(): string {
        return this.sourceCode.charAt(this.current++)
    }

    addToken(type: TokenKind): void {
        return this.addTokenWithLiteral(type, null)
    }

    addTokenWithLiteral(type: TokenKind, literal: unknown): void {
        const text = this.sourceCode.substring(this.start, this.current)
        this.tokens.push(new Token(type, text, literal, this.line))
    }
}

export default Lexer
