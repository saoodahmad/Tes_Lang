import Visitor from './Visitor'

export default abstract class Declaration {
    abstract accept<T>(visitor: Visitor<T>): T
}
