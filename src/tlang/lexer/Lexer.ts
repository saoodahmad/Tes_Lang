import TLang from '../TLang'
import Token from './Token'
import { TokenKind } from './TokenType.enum'

class Lexer {
    sourceCode: string

    tokens: Array<Token> = []

    start = 0

    current = 0

    line = 1

    static keywords: Map<string, TokenKind> = this.initializeKeywords()

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
                if (this.isAtEnd()) {
                    this.addToken(TokenKind.SLASH)
                    break
                }
                if (this.match('/')) {
                    this.lineComment()
                } else if (this.match('*')) {
                    this.blockComment()
                } else {
                    this.addToken(TokenKind.SLASH)
                }
                break

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
                if (this.isDigit(c)) {
                    this.number()
                } else if (this.isAlphabet(c)) {
                    this.identifier()
                } else {
                    TLang.reportError(this.line, `Unexpected character '${c}'`)
                }
                break
        }
    }

    static initializeKeywords(): Map<string, TokenKind> {
        const keywords = new Map<string, TokenKind>()

        keywords.set('and', TokenKind.AND)
        keywords.set('class', TokenKind.CLASS)
        keywords.set('else', TokenKind.ELSE)
        keywords.set('false', TokenKind.FALSE)
        keywords.set('for', TokenKind.FOR)
        keywords.set('fun', TokenKind.FUN)
        keywords.set('if', TokenKind.IF)
        keywords.set('nil', TokenKind.NIL)
        keywords.set('or', TokenKind.OR)
        keywords.set('print', TokenKind.PRINT)
        keywords.set('return', TokenKind.RETURN)
        keywords.set('super', TokenKind.SUPER)
        keywords.set('this', TokenKind.THIS)
        keywords.set('true', TokenKind.TRUE)
        keywords.set('var', TokenKind.VAR)
        keywords.set('while', TokenKind.WHILE)

        return keywords
    }

    isDigit(c: string): boolean {
        if (c >= '0' && c <= '9') {
            return true
        }

        return false
    }

    isAlphabet(c: string): boolean {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'
    }

    isAplhaNumeric(c: string): boolean {
        return this.isAlphabet(c) || this.isDigit(c)
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

    peekNext(): string {
        if (this.current + 1 >= this.sourceCode.length) {
            return '\n'
        }

        return this.sourceCode.charAt(this.current + 1)
    }

    string(): void {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === '\n') this.line++
            this.advance()
        }
        if (this.peek() !== '"') {
            TLang.reportError(this.line, `Unterminated string`)
            return
        }

        this.advance()

        const value = this.sourceCode.substring(
            this.start + 1,
            this.current - 1
        )
        this.addTokenWithLiteral(TokenKind.STRING, value)
    }

    number(): void {
        while (this.isDigit(this.peek())) {
            this.advance()
        }

        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            this.advance()

            while (this.isDigit(this.peek())) {
                this.advance()
            }
        }

        this.addTokenWithLiteral(
            TokenKind.NUMBER,
            Number(this.sourceCode.substring(this.start, this.current))
        )
    }

    identifier(): void {
        while (this.isAplhaNumeric(this.peek())) {
            this.advance()
        }

        const text = this.sourceCode.substring(this.start, this.current)
        let type = Lexer.keywords.get(text)

        if (!type) {
            type = TokenKind.IDENTIFIER
        }
        this.addToken(type)
    }

    lineComment(): void {
        while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance()
        }
    }

    blockComment(): void {
        while (!this.isAtEnd()) {
            if (this.peek() === '\n') {
                this.line++
            } else if (this.peek() === '*' && this.peekNext() === '/') {
                break
            }
            this.advance()
        }

        if (this.isAtEnd()) {
            TLang.reportError(this.line, 'Unterminated comments')
            return
        }

        if (this.peekNext() === '/') {
            this.advance() // consume '*'
            this.advance() // consume '/'
        }
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
