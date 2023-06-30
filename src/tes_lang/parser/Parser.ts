import TesLang from '../TesLang'
import Token from '../lexer/Token'
import { TokenKind } from '../lexer/TokenType.enum'
import ParseError from './ParseError'
import BinaryExpression from '../syntax/expression/BinaryExpression'
import Expression from '../syntax/expression/Expression'
import GroupingExpression from '../syntax/expression/GroupingExpression'
import LiteralExpression from '../syntax/expression/LiteralExpression'
import UnaryExpression from '../syntax/expression/UnaryExpression'
import Statement from '../syntax/statement/Statement'
import PrintStatement from '../syntax/statement/PrintStatement'
import ExpressionStatement from '../syntax/statement/ExpressionStatment'
import Declaration from '../syntax/declaration/Declaration'
import VariableDeclaration from '../syntax/declaration/VariableDeclaration'
import VariableExpression from '../syntax/expression/VariableExpression'
import AssignExpression from '../syntax/expression/AssignExpression'
import BlockStatement from '../syntax/statement/BlockStatement'
import IfStatement from '../syntax/statement/IfStatement'
import LogicalExpression from '../syntax/expression/LogicalExpression'

export default class Parser {
    tokens = new Array<Token>()

    current = 0

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    parse(): Declaration[] {
        try {
            const declarations: Declaration[] = []

            while (!this.isAtEnd()) {
                declarations.push(this.declaration())
            }
            return declarations
        } catch (error) {
            return null
        }
    }

    declaration(): Declaration {
        if (this.match([TokenKind.VAR])) {
            const identifier = this.advance()

            let initializer: Expression = null

            if (this.match([TokenKind.EQUAL])) {
                initializer = this.expression()
            }

            this.consume(
                TokenKind.SEMICOLON,
                "Expect ';' after variable declaration"
            )

            return new VariableDeclaration(identifier, initializer)
        }

        return this.statement()
    }

    statement(): Statement {
        if (this.match([TokenKind.IF])) {
            return this.ifStatment()
        }

        if (this.match([TokenKind.PRINT])) {
            return this.printStatement()
        }
        if (this.match([TokenKind.LEFT_BRACE])) {
            return this.blockStatement()
        }

        return this.expressionStatment()
    }

    ifStatment(): IfStatement {
        this.consume(TokenKind.LEFT_PAREN, "Expect '(' after 'if'.")

        const condition = this.expression()

        this.consume(TokenKind.RIGHT_PAREN, "Expect ')' after if condition.")

        const thenBranch = this.statement()

        let elseBranch = null

        if (this.match([TokenKind.ELSE])) {
            elseBranch = this.statement()
        }

        return new IfStatement(condition, thenBranch, elseBranch)
    }

    printStatement(): PrintStatement {
        const value: Expression = this.expression()

        this.consume(TokenKind.SEMICOLON, "Expect ';' after value")

        return new PrintStatement(value)
    }

    expressionStatment(): ExpressionStatement {
        const value: Expression = this.expression()

        this.consume(TokenKind.SEMICOLON, "Expect ';' after value")

        return new ExpressionStatement(value)
    }

    blockStatement(): BlockStatement {
        const declarations: Declaration[] = []

        while (!this.check(TokenKind.RIGHT_BRACE) && !this.isAtEnd()) {
            declarations.push(this.declaration())
        }

        this.consume(TokenKind.RIGHT_BRACE, "Expect '}' after block.")

        return new BlockStatement(declarations)
    }

    expression(): Expression {
        return this.assignment()
    }

    assignment(): Expression {
        const expr = this.or()

        if (this.match([TokenKind.EQUAL])) {
            const equals: Token = this.previous()

            const value: Expression = this.assignment()

            if (expr instanceof VariableExpression) {
                return new AssignExpression(expr.name, value)
            }

            this.error(equals, 'Invalid assignemt target.')
        }

        return expr
    }

    or(): Expression {
        let left = this.and()

        while (this.match([TokenKind.OR])) {
            const operator = this.previous()

            const right = this.and()

            left = new LogicalExpression(left, operator, right)
        }

        return left
    }

    and(): Expression {
        let left = this.equality()

        while (this.match([TokenKind.AND])) {
            const operator = this.previous()

            const right = this.and()

            left = new LogicalExpression(left, operator, right)
        }

        return left
    }

    equality(): Expression {
        let expr = this.comparison()

        while (this.match([TokenKind.BANG_EQUAL, TokenKind.EQUAL_EQUAL])) {
            const operator = this.previous()

            const right = this.comparison()

            expr = new BinaryExpression(expr, operator, right)
        }

        return expr
    }

    comparison(): Expression {
        let expr = this.term()

        while (
            this.match([
                TokenKind.GREATER,
                TokenKind.GREATER_EQUAL,
                TokenKind.LESS,
                TokenKind.LESS_EQUAL,
            ])
        ) {
            const operator = this.previous()

            const right = this.term()

            expr = new BinaryExpression(expr, operator, right)
        }

        return expr
    }

    term(): Expression {
        let expr = this.factor()

        // console.log('left', expr)

        while (this.match([TokenKind.PLUS, TokenKind.MINUS])) {
            const operator = this.previous()

            const right = this.factor()

            // console.log(right, 'expr')

            expr = new BinaryExpression(expr, operator, right)
        }

        // console.log(expr)

        return expr
    }

    factor(): Expression {
        let expr = this.unary()
        while (this.match([TokenKind.SLASH, TokenKind.STAR])) {
            const operator = this.previous()

            const right = this.unary()

            expr = new BinaryExpression(expr, operator, right)
        }

        return expr
    }

    unary(): Expression {
        if (this.match([TokenKind.BANG, TokenKind.MINUS])) {
            const operator = this.previous()

            const expr = this.unary()

            return new UnaryExpression(operator, expr)
        }

        return this.primary()
    }

    primary(): Expression {
        if (this.match([TokenKind.FALSE])) {
            return new LiteralExpression(false)
        }

        if (this.match([TokenKind.TRUE])) {
            return new LiteralExpression(true)
        }

        if (this.match([TokenKind.NIL])) {
            return new LiteralExpression(null)
        }

        if (this.match([TokenKind.NUMBER, TokenKind.STRING])) {
            return new LiteralExpression(this.previous().literal)
        }

        if (this.match([TokenKind.IDENTIFIER])) {
            return new VariableExpression(this.previous())
        }

        if (this.match([TokenKind.LEFT_PAREN])) {
            const expr = this.expression()
            this.consume(TokenKind.RIGHT_PAREN, "Expect ')' after expression.")
            return new GroupingExpression(expr)
        }

        throw this.error(this.peek(), 'Expect expression.')
    }

    match(tokenKinds: TokenKind[]): boolean {
        for (let i = 0; i < tokenKinds.length; i++) {
            if (this.check(tokenKinds[i])) {
                this.advance()
                return true
            }
        }

        return false
    }

    consume(type: TokenKind, message: string): Token {
        if (this.check(type)) return this.advance()

        throw this.error(this.peek(), message)
    }

    check(type: TokenKind): boolean {
        if (this.isAtEnd()) return false

        return this.peek().type === type
    }

    advance(): Token {
        if (!this.isAtEnd()) this.current++
        return this.previous()
    }

    isAtEnd(): boolean {
        return this.peek().type === TokenKind.EOF
    }

    peek(): Token {
        return this.tokens[this.current]
    }

    previous(): Token {
        return this.tokens[this.current - 1]
    }

    error(token: Token, message: string) {
        TesLang.reportParserError(token, message)
        // this.synchronize()
        return new ParseError()
    }

    synchronize(): void {
        this.advance()

        while (!this.isAtEnd()) {
            if (this.previous().type === TokenKind.SEMICOLON) return

            // eslint-disable-next-line default-case
            switch (this.peek().type) {
                case TokenKind.CLASS:
                case TokenKind.FUN:
                case TokenKind.VAR:
                case TokenKind.FOR:
                case TokenKind.IF:
                case TokenKind.WHILE:
                case TokenKind.PRINT:
                case TokenKind.RETURN:
                    return
            }

            this.advance()
        }
    }
}
