import VariableDeclaration from './VariableDeclaration'

import AssignExpression from '../expression/AssignExpression'
import BinaryExpression from '../expression/BinaryExpression'
import GroupingExpression from '../expression/GroupingExpression'
import LiteralExpression from '../expression/LiteralExpression'
import LogicalExpression from '../expression/LogicalExpression'
import UnaryExpression from '../expression/UnaryExpression'
import VariableExpression from '../expression/VariableExpression'
import BlockStatement from '../statement/BlockStatement'
import BreakStatement from '../statement/BreakStatement'
import ExpressionStatement from '../statement/ExpressionStatment'
import IfStatement from '../statement/IfStatement'
import PrintStatement from '../statement/PrintStatement'
import WhileStatment from '../statement/WhileStatement'
import ForStatment from '../statement/ForStatement'
import ContinueStatement from '../statement/ContinueStatement'

export default interface Visitor<T> {
    visitVariableDeclaration(declaration: VariableDeclaration): T

    visitExpressionStatment(statement: ExpressionStatement): T
    visitForStatement(statement: ForStatment): T
    visitIfStatement(statement: IfStatement): T
    visitPrintStatement(statement: PrintStatement): T
    visitWhileStatement(statement: WhileStatment): T
    visitBlockStatement(statement: BlockStatement): T
    visitBreakStatement(statement: BreakStatement): T
    visitContinueStatement(statement: ContinueStatement): T

    visitBinaryExpression(expression: BinaryExpression): T
    visitUnaryExpression(expression: UnaryExpression): T
    visitLiteralExpression(expression: LiteralExpression): T
    visitGroupingExpression(expression: GroupingExpression): T
    visitVariableExpression(expression: VariableExpression): T
    visitAssignExpression(expression: AssignExpression): T
    visitLogicalExpression(expression: LogicalExpression): T
}
