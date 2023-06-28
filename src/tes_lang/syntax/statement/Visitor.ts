import ExpressionStatement from './ExpressionStatment'
import PrintStatement from './PrintStatement'

export default interface Visitor<T> {
    visitExpressionStatment(stmt: ExpressionStatement): T
    visitPrintStatement(stmt: PrintStatement): T
}
