import Environment from '../environment/Environment'
import FunctionDeclaration from '../syntax/declaration/FunctionDeclaration'
import Callable from './Callable'
import Interpreter from './Interpreter'
import Return from './Return'

export default class Function implements Callable {
    private readonly declaration: FunctionDeclaration

    constructor(declaration: FunctionDeclaration) {
        this.declaration = declaration
    }

    airty(): number {
        return this.declaration.formalArguments.length
    }

    call(interpreter: Interpreter, callArguments: unknown[]): unknown {
        const environment = new Environment(interpreter.globals)

        this.declaration.formalArguments.forEach((formalArgument, idx) => {
            environment.define(formalArgument.lexeme, callArguments[idx])
        })

        try {
            interpreter.executeBlock(
                this.declaration.body.declarations,
                environment
            )
        } catch (error) {
            if (error instanceof Return) {
                return error.returnValue
            }
            console.log(error)
        }

        return null
    }
}
