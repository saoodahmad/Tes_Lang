import AssignExpression from '../expression/AssignExpression'
import BinaryExpression from '../expression/BinaryExpression'
import GroupingExpression from '../expression/GroupingExpression'
import LiteralExpression from '../expression/LiteralExpression'
import LogicalExpression from '../expression/LogicalExpression'
import UnaryExpression from '../expression/UnaryExpression'
import VariableExpression from '../expression/VariableExpression'
import BlockStatement from '../statement/BlockStatement'
import ExpressionStatement from '../statement/ExpressionStatment'
import IfStatement from '../statement/IfStatement'
import PrintStatement from '../statement/PrintStatement'

import VariableDeclaration from './VariableDeclaration'

export default interface Visitor<T> {
    visitVariableDeclaration(declaration: VariableDeclaration): T

    visitExpressionStatment(statement: ExpressionStatement): T
    visitIfStatement(statement: IfStatement): T
    visitPrintStatement(statement: PrintStatement): T
    visitBlockStatement(statement: BlockStatement): T

    visitBinaryExpression(expression: BinaryExpression): T
    visitUnaryExpression(expression: UnaryExpression): T
    visitLiteralExpression(expression: LiteralExpression): T
    visitGroupingExpression(expression: GroupingExpression): T
    visitVariableExpression(expression: VariableExpression): T
    visitAssignExpression(expression: AssignExpression): T
    visitLogicalExpression(expression: LogicalExpression): T
}
