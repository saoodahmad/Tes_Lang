import TesLang from '../TesLang'
import Token from '../lexer/Token'
import { TokenKind } from '../lexer/TokenType.enum'
import BinaryExpression from '../syntax/expression/BinaryExpression'
import Expression from '../syntax/expression/Expression'
import GroupingExpression from '../syntax/expression/GroupingExpression'
import LiteralExpression from '../syntax/expression/LiteralExpression'
import UnaryExpression from '../syntax/expression/UnaryExpression'
import expressionVisitor from '../syntax/expression/Visitor'
import RuntimeError from './RuntimeError'

export default class Interpreter implements expressionVisitor<any> {
    interpret(expression: Expression) {
        try {
            const value = this.evaluate(expression)
            console.log(value)
        } catch (error) {
            TesLang.runTimeError(error)
        }
    }

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

                throw new RuntimeError(
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

    checkNumberOperand(operator: Token, operand: unknown) {
        if (!Number.isNaN(operand)) return
        throw new RuntimeError(operator, 'Operand must be a number.')
    }

    checkNumberOperands(operator: Token, left: unknown, right: unknown) {
        if (!Number.isNaN(left) && !Number.isNaN(right)) return
        throw new RuntimeError(operator, 'Operands must be a number.')
    }

    visitLiteralExpression(expression: LiteralExpression): any {
        return expression.value
    }

    visitGroupingExpression(expression: GroupingExpression) {
        return this.evaluate(expression.expression)
    }

    private evaluate(expression: Expression) {
        return expression.accept(this)
    }

    private isTruthy(object: any): boolean {
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
}
