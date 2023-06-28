import TesLang from '../TesLang'
import Token from '../lexer/Token'
import { TokenKind } from '../lexer/TokenType.enum'
import BinaryExpression from '../syntax/expression/BinaryExpression'
import Expression from '../syntax/expression/Expression'
import GroupingExpression from '../syntax/expression/GroupingExpression'
import LiteralExpression from '../syntax/expression/LiteralExpression'
import UnaryExpression from '../syntax/expression/UnaryExpression'
import expressionVisitor from '../syntax/expression/Visitor'
import ExpressionStatement from '../syntax/statement/ExpressionStatment'
import PrintStatement from '../syntax/statement/PrintStatement'
import Statement from '../syntax/statement/Statement'
import statementVisitor from '../syntax/statement/Visitor'
import RuntimeError from './RuntimeError'

export default class Interpreter
    implements expressionVisitor<unknown>, statementVisitor<unknown>
{
    visitBinaryExpression(expression: BinaryExpression) {
        const left = this.evaluate(expression.left)

        const right = this.evaluate(expression.right)

        switch (expression.operator.type) {
            case TokenKind.GREATER:
                this.checkNumberOperands(expression.operator, left, right)
                return parseFloat(left) > parseFloat(right)
            case TokenKind.GREATER_EQUAL:
                this.checkNumberOperands(expression.operator, left, right)
                return parseFloat(left) >= parseFloat(right)
            case TokenKind.LESS:
                this.checkNumberOperands(expression.operator, left, right)
                return parseFloat(left) < parseFloat(right)
            case TokenKind.LESS_EQUAL:
                this.checkNumberOperands(expression.operator, left, right)
                return parseFloat(left) <= parseFloat(right)
            case TokenKind.MINUS:
                this.checkNumberOperand(expression.operator, right)

                return parseFloat(left) - parseFloat(right)
            case TokenKind.PLUS:
                if (typeof left === 'number' && typeof right === 'number') {
                    return left + right
                }

                if (typeof left === 'string' && typeof right === 'string') {
                    return left + right
                }

                return this.error(
                    expression.operator,
                    'Operands must be two numbers or two strings.'
                )

            case TokenKind.SLASH:
                this.checkNumberOperands(expression.operator, left, right)
                return parseFloat(left) / parseFloat(right)
            case TokenKind.STAR:
                this.checkNumberOperands(expression.operator, left, right)
                return parseFloat(left) * parseFloat(right)
            case TokenKind.BANG_EQUAL:
                return !this.isEqual(left, right)
            case TokenKind.EQUAL_EQUAL:
                return this.isEqual(left, right)
            default:
        }

        return null
    }

    visitUnaryExpression(expression: UnaryExpression) {
        const right = this.evaluate(expression.right)

        switch (expression.operator.type) {
            case TokenKind.BANG:
                return !this.isTruthy(right)

            case TokenKind.MINUS:
                return -parseFloat(right)
            default:
        }

        return null
    }

    visitExpressionStatment(stmt: ExpressionStatement): unknown {
        this.evaluate(stmt.expression)
        return null
    }

    visitPrintStatement(stmt: PrintStatement): unknown {
        const value = this.evaluate(stmt.expression)
        TesLang.output += `${value}\n`
        return null
    }

    interpret(statements: Statement[]) {
        try {
            statements.forEach((statement) => {
                this.execute(statement)
            })
        } catch (error) {
            TesLang.reportInpterpreterError(error)
        }
    }

    checkNumberOperand(operator: Token, operand: unknown): unknown {
        if (!Number.isNaN(operand)) return null

        return this.error(operator, 'Operand must be a number.')
    }

    checkNumberOperands(
        operator: Token,
        left: unknown,
        right: unknown
    ): unknown {
        if (!Number.isNaN(left) && !Number.isNaN(right)) return null
        return this.error(operator, 'Operands must be a number.')
    }

    visitLiteralExpression(expression: LiteralExpression): unknown {
        return expression.value
    }

    visitGroupingExpression(expression: GroupingExpression) {
        return this.evaluate(expression.expression)
    }

    private evaluate(expression: Expression) {
        return expression.accept(this)
    }

    private execute(statement: Statement) {
        return statement.accept(this)
    }

    private isTruthy(object: unknown): boolean {
        if (object == null) return false

        if (object === true || object === false) return object

        return true
    }

    private isEqual(left: unknown, right: unknown): boolean {
        if (left !== right) {
            return false
        }

        return true
    }

    error(token: Token, message: string) {
        throw new RuntimeError(token, message)
    }
}
