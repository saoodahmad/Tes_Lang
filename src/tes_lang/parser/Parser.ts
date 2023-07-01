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
import WhileStatment from '../syntax/statement/WhileStatement'
import BreakStatement from '../syntax/statement/BreakStatement'
import ForStatment from '../syntax/statement/ForStatement'
import ContinueStatement from '../syntax/statement/ContinueStatement'
import CallExpression from '../syntax/expression/CallExpression'
import FunctionDeclaration from '../syntax/declaration/FunctionDeclaration'
import ReturnStatement from '../syntax/statement/ReturnStatement'

export default class Parser {
    tokens = new Array<Token>()

    current = 0

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    nestedLoopCount = 0

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
        if (this.match([TokenKind.FUN])) {
            return this.functionDeclaration()
        }

        if (this.match([TokenKind.VAR])) {
            return this.variableDeclaration()
        }

        return this.statement()
    }

    functionDeclaration(): FunctionDeclaration {
        const name = this.consume(
            TokenKind.IDENTIFIER,
            "Expect function name  after 'fun'."
        )

        this.consume(TokenKind.LEFT_PAREN, "Expect '(' after function name.")

        const formalArguments: Token[] = []

        if (!this.check(TokenKind.RIGHT_PAREN)) {
            do {
                formalArguments.push(
                    this.consume(
                        TokenKind.IDENTIFIER,
                        'Expected identifer (argument name).'
                    )
                )
            } while (this.match([TokenKind.COMMA]))
        }

        this.consume(TokenKind.RIGHT_PAREN, "Expect ')' after alst argument.")

        this.consume(TokenKind.LEFT_BRACE, "Expect '{' before function body")

        const body = this.blockStatement()

        return new FunctionDeclaration(name, formalArguments, body)
    }

    variableDeclaration(): VariableDeclaration {
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

    statement(): Statement {
        if (this.match([TokenKind.FOR])) {
            return this.forStatement()
        }

        if (this.match([TokenKind.IF])) {
            return this.ifStatment()
        }

        if (this.match([TokenKind.PRINT])) {
            return this.printStatement()
        }

        if (this.match([TokenKind.BREAK])) {
            return this.breakStatement()
        }

        if (this.match([TokenKind.CONTINUE])) {
            return this.continueStatement()
        }

        if (this.match([TokenKind.RETURN])) {
            return this.returnStatement()
        }

        if (this.match([TokenKind.WHILE])) {
            return this.WhileStatment()
        }

        if (this.match([TokenKind.LEFT_BRACE])) {
            return this.blockStatement()
        }

        return this.expressionStatment()
    }

    forStatement(): ForStatment {
        this.consume(TokenKind.LEFT_PAREN, "Expect '(' after 'if'.")

        let initializer = null

        if (!this.match([TokenKind.SEMICOLON])) {
            if (this.match([TokenKind.VAR])) {
                initializer = this.variableDeclaration()
            } else {
                initializer = this.expressionStatment()
            }
        }

        let condition = null

        if (!this.check(TokenKind.SEMICOLON)) {
            condition = this.expression()
        } else {
            condition = new LiteralExpression(true)
        }

        this.consume(TokenKind.SEMICOLON, "Expect ';'  after loop condition")

        let increment = null

        if (!this.check(TokenKind.RIGHT_PAREN)) {
            increment = this.expression()
        }

        this.consume(
            TokenKind.RIGHT_PAREN,
            "Expect ')'  after increment condition"
        )

        try {
            this.nestedLoopCount++

            const body = this.statement()

            return new ForStatment(initializer, condition, increment, body)
        } finally {
            this.nestedLoopCount--
        }
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

    breakStatement(): BreakStatement {
        if (this.nestedLoopCount === 0) {
            throw this.error(this.previous(), "'break' can used within loop")
        }

        this.consume(TokenKind.SEMICOLON, "Expect ';' after break")

        return new BreakStatement()
    }

    continueStatement(): ContinueStatement {
        if (this.nestedLoopCount === 0) {
            throw this.error(this.previous(), "'continue' can used within loop")
        }

        this.consume(TokenKind.SEMICOLON, "Expect ';' after break")

        return new ContinueStatement()
    }

    returnStatement(): ReturnStatement {
        const name = this.previous()

        let value: Expression = null

        if (!this.check(TokenKind.SEMICOLON)) {
            value = this.expression()
        }

        this.consume(TokenKind.SEMICOLON, "Expect ';'  after retur value.")

        return new ReturnStatement(name, value)
    }

    WhileStatment(): WhileStatment {
        this.consume(TokenKind.LEFT_PAREN, "Expect '(' after 'while'.")

        const condition = this.expression()

        this.consume(TokenKind.RIGHT_PAREN, "Expect ')' after condition .")

        try {
            this.nestedLoopCount++
            const body = this.statement()
            return new WhileStatment(condition, body)
        } finally {
            this.nestedLoopCount--
        }
    }

    blockStatement(): BlockStatement {
        const declarations: Declaration[] = []

        while (!this.check(TokenKind.RIGHT_BRACE) && !this.isAtEnd()) {
            declarations.push(this.declaration())
        }

        this.consume(TokenKind.RIGHT_BRACE, "Expect '}' after block.")

        return new BlockStatement(declarations)
    }

    expressionStatment(): ExpressionStatement {
        const value: Expression = this.expression()

        this.consume(TokenKind.SEMICOLON, "Expect ';' after value")

        return new ExpressionStatement(value)
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

        while (this.match([TokenKind.PLUS, TokenKind.MINUS])) {
            const operator = this.previous()

            const right = this.factor()

            expr = new BinaryExpression(expr, operator, right)
        }

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

        return this.call()
    }

    call(): Expression {
        let expr = this.primary()

        // supports hello()()
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (this.match([TokenKind.LEFT_PAREN])) {
                expr = this.finishCall(expr)
            } else {
                break
            }
        }

        return expr
    }

    finishCall(callee: Expression): CallExpression {
        const callArguments: Expression[] = []

        if (!this.check(TokenKind.RIGHT_PAREN)) {
            do {
                callArguments.push(this.expression())
            } while (this.match([TokenKind.COMMA]))
        }

        const closingParan = this.consume(
            TokenKind.RIGHT_PAREN,
            "Expect ')' after arguments"
        )

        if (callArguments.length > 5) {
            this.error(this.peek(), 'Too many arguments, max allowed is 5')
        }

        return new CallExpression(callee, closingParan, callArguments)
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
                case TokenKind.BREAK:
                case TokenKind.CONTINUE:
                    return
            }

            this.advance()
        }
    }
}
