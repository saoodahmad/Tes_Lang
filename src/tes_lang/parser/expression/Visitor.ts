import BinaryExpression from './BinaryExpression'
import GroupingExpression from './GroupingExpression'
import LiteralExpression from './LiteralExpression'
import UnaryExpression from './UnaryExpression'

export default interface Visitor<T> {
    visitBinaryExpression(expression: BinaryExpression): T
    visitUnaryExpression(expression: UnaryExpression): T
    visitLiteralExpression(expression: LiteralExpression): T
    visitGroupingExpression(expression: GroupingExpression): T
}
