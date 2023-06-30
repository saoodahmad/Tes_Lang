import Expression from './Expression'
import Visitor from '../declaration/Visitor'

export default class GroupingExpression extends Expression {
    expression: Expression

    constructor(expression: Expression) {
        super()
        this.expression = expression
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitGroupingExpression(this)
    }
}
