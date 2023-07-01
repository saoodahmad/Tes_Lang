// eslint-disable-next-line max-classes-per-file
import Callable from './Callable'
import Interpreter from './Interpreter'

export class Millis implements Callable {
    airty(): number {
        return 0
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    call(_interpreter: Interpreter, _callArguments: unknown[]): unknown {
        return new Date().getMilliseconds()
    }
}

export class Minimum implements Callable {
    airty(): number {
        return 2
    }

    call(_interpreter: Interpreter, callArguments: unknown[]): unknown {
        return Math.min(Number(callArguments[0]), Number(callArguments[1]))
    }
}
