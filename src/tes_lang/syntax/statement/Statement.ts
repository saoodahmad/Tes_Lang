import Declaration from '../Declaration'
import Visitor from './Visitor'

export default abstract class Statement extends Declaration {
    abstract accept<T>(visitor: Visitor<T>): T
}
