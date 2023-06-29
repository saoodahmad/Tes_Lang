import Lexer from './lexer/Lexer'
import Token from './lexer/Token'
import { TokenKind } from './lexer/TokenType.enum'
import Parser from './parser/Parser'
import RuntimeError from './interpreter/RuntimeError'
import Interpreter from './interpreter/Interpreter'

class TesLang {
    static hasLexicalError = false

    static hasParserError = false

    static hasInterpreterError = false

    static output = ''

    static error = ''

    private static interpreter: Interpreter = new Interpreter()

    static report(line: number, where: string, message: string) {
        TesLang.error += `${`[Line ${line}] ${TesLang.getErrorType()} Error ${where}: ${message}`}\n`
    }

    static getErrorType(): string {
        if (TesLang.hasLexicalError) {
            return 'Lexer'
        }

        if (TesLang.hasParserError) {
            return 'Parser'
        }

        if (TesLang.hasInterpreterError) {
            return 'Interpreter'
        }

        return ''
    }

    static reportLexicalError(line: number, message: string) {
        TesLang.hasLexicalError = true
        this.report(line, '', message)
    }

    static reportParserError(token: Token, message: string): void {
        TesLang.hasParserError = true
        if (token.type === TokenKind.EOF) {
            this.report(token.line, ' at end', message)
        } else {
            this.report(token.line, ` at '${token.lexeme}'`, message)
        }
    }

    static reportInpterpreterError(error: RuntimeError) {
        TesLang.hasInterpreterError = true
        this.report(error.token.line, '', error.message)
    }

    static run(source: string) {
        const lexer: Lexer = new Lexer(source)

        const tokens: Array<Token> = lexer.lex()

        if (TesLang.hasLexicalError) return

        const parser: Parser = new Parser(tokens)

        const statements = parser.parse()

        if (TesLang.hasParserError) return

        this.interpreter.interpret(statements)
    }
}

export default TesLang
