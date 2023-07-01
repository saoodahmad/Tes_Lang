import Interpreter from './Interpreter'

export default interface Callable {
    airty(): number
    call(interpreter: Interpreter, callArguments: unknown[]): unknown
}
