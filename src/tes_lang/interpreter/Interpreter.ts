import TesLang from '../TesLang'
import Token from '../lexer/Token'
import { TokenKind } from '../lexer/TokenType.enum'
import BinaryExpression from '../syntax/expression/BinaryExpression'
import Expression from '../syntax/expression/Expression'
import GroupingExpression from '../syntax/expression/GroupingExpression'
import LiteralExpression from '../syntax/expression/LiteralExpression'
import UnaryExpression from '../syntax/expression/UnaryExpression'

import ExpressionStatement from '../syntax/statement/ExpressionStatment'
import PrintStatement from '../syntax/statement/PrintStatement'

import visitor from '../syntax/declaration/Visitor'
import RuntimeError from './RuntimeError'
import VariableDeclaration from '../syntax/declaration/VariableDeclaration'
import Declaration from '../syntax/declaration/Declaration'
import VariableExpression from '../syntax/expression/VariableExpression'
import Environment from '../environment/Environment'
import AssignExpression from '../syntax/expression/AssignExpression'
import BlockStatement from '../syntax/statement/BlockStatement'
import IfStatement from '../syntax/statement/IfStatement'
import LogicalExpression from '../syntax/expression/LogicalExpression'
import WhileStatment from '../syntax/statement/WhileStatement'
import BreakStatement from '../syntax/statement/BreakStatement'
import BreakError from './BreakError'
import ForStatment from '../syntax/statement/ForStatement'
import ContinueStatement from '../syntax/statement/ContinueStatement'

export default class Interpreter implements visitor<unknown> {
    private environment: Environment = new Environment()

    private skip = false

    interpret(declarations: Declaration[]) {
        try {
            declarations.forEach((declaration) => {
                this.execute(declaration)
            })
        } catch (error) {
            TesLang.reportInpterpreterError(error)
        }
    }

    visitVariableDeclaration(declaration: VariableDeclaration): unknown {
        let value: unknown = null

        if (declaration.initializer != null) {
            value = this.evaluate(declaration.initializer)
        }

        this.environment.defineVariable(declaration.name, value)

        return null
    }

    visitExpressionStatment(stmt: ExpressionStatement): unknown {
        this.evaluate(stmt.expression)
        return null
    }

    visitForStatement(statement: ForStatment): unknown {
        try {
            // console.log('for')
            if (statement.intializer) {
                this.execute(statement.intializer)
            }

            while (this.isTruthy(this.evaluate(statement.condition))) {
                // console.log(this.skip)
                this.execute(statement.body)
                this.skip = false
                if (statement.increment) {
                    this.evaluate(statement.increment)
                }
            }
        } catch (err: unknown) {
            // console.log(err)
            if (err instanceof BreakError) {
                // console.log('break occured')
            }
        }

        return null
    }

    visitIfStatement(statement: IfStatement): unknown {
        if (this.isTruthy(this.evaluate(statement.condition))) {
            this.execute(statement.thenBranch)
        } else if (statement.elseBranch != null) {
            this.execute(statement.elseBranch)
        }

        return null
    }

    visitPrintStatement(stmt: PrintStatement): unknown {
        const value = this.evaluate(stmt.expression)
        TesLang.output += `${value}\n`
        return null
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitBreakStatement(_statement: BreakStatement): unknown {
        throw new BreakError()
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitContinueStatement(_statement: ContinueStatement): unknown {
        this.skip = true
        return null
    }

    visitWhileStatement(statement: WhileStatment): unknown {
        try {
            while (this.isTruthy(this.evaluate(statement.condition))) {
                this.execute(statement.body)
                this.skip = false
            }
        } catch (err: unknown) {
            if (err instanceof BreakError) {
                // console.log('break occured')
            }
        }

        return null
    }

    visitBlockStatement(statement: BlockStatement): unknown {
        // console.log(BlockStatement)
        this.executeBlock(
            statement.declarations,
            new Environment(this.environment)
        )
        return null
    }

    visitAssignExpression(expression: AssignExpression): unknown {
        const value = this.evaluate(expression.value)
        this.environment.assign(expression.name, value)

        return value
    }

    visitVariableExpression(expression: VariableExpression): unknown {
        return this.environment.get(expression.name)
    }

    visitLogicalExpression(expression: LogicalExpression): unknown {
        const left = this.evaluate(expression.left)

        if (expression.operator.type === TokenKind.OR) {
            if (this.isTruthy(left)) return left
        } else if (!this.isTruthy(left)) return left

        return this.evaluate(expression.right)
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

    private execute(declaration: Declaration) {
        if (this.skip) return null

        return declaration.accept(this)
    }

    private executeBlock(
        declarations: Declaration[],
        environment: Environment
    ) {
        const previous = this.environment

        try {
            this.environment = environment

            declarations.forEach((declaration) => {
                this.execute(declaration)
            })
        } finally {
            this.environment = previous
        }
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
