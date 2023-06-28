import Declaration from '../Declaration'
import Visitor from './Visitor'

export default abstract class Expression extends Declaration {
    abstract accept<T>(visitor: Visitor<T>): T
}
