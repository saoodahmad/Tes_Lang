import chalk from 'chalk'
import * as fs from 'fs'
import { createInterface } from 'readline'
import Lexer from './lexer/Lexer'
import Token from './lexer/Token'
import { TokenKind } from './lexer/TokenType.enum'
import Parser from './parser/Parser'
import RuntimeError from './interpreter/RuntimeError'
import Interpreter from './interpreter/Interpreter'

class TesLang {
    static hadError = false

    static hadRuntimeError = false

    static output = ''

    static errorOutput = ''

    private static interpreter: Interpreter = new Interpreter()

    static main(): void {
        console.info(
            chalk.hex('#83aaff')(`       
            ████████╗███████╗░██████╗
            ╚══██╔══╝██╔════╝██╔════╝
            ░░░██║░░░█████╗░░╚█████╗░
            ░░░██║░░░██╔══╝░░░╚═══██╗
            ░░░██║░░░███████╗██████╔╝
            ░░░╚═╝░░░╚══════╝╚═════╝░
      https://github.com/saoodahmad/Tes_Lang
          `)
        )

        const args: string[] = process.argv.slice(2)

        if (args.length > 1) {
            console.info(
                chalk.hex('#83aaff')(`\tcommand: npm start <filepath>`)
            )
            process.exit(0)
        } else if (args.length === 1) {
            this.runFile(args[0])
        } else {
            this.runPrompt()
        }
    }

    static report(line: number, where: string, message: string) {
        console.error(chalk.red(`[Line ${line}] Error ${where}: ${message}`))
    }

    static error(token: Token, message: string): void {
        if (token.type === TokenKind.EOF) {
            this.report(token.line, ' at end', message)
        } else {
            this.report(token.line, ` at '${token.lexeme}'`, message)
        }
    }

    static runTimeError(error: RuntimeError) {
        console.log(chalk.red(`[Line ${error.token.line}] ${error.message}`))
        TesLang.hadRuntimeError = true
    }

    static reportError(line: number, message: string) {
        this.report(line, '', message)
        TesLang.hadError = true
    }

    static run(source: string) {
        if (source.trim().length === 0) {
            return
        }

        const lexer: Lexer = new Lexer(source)

        const tokens: Array<Token> = lexer.lex()

        const parser: Parser = new Parser(tokens)

        const statements = parser.parse()

        if (this.hadError) return

        this.interpreter.interpret(statements)
    }

    static runFile(path: string) {
        try {
            if (path.indexOf('.tes') === -1) {
                console.error(chalk.red(`Invalid file extension`))
                return
            }
            const sourceCode = fs.readFileSync(path, 'utf8')

            this.run(sourceCode)

            if (this.hadError) process.exit(1)

            if (this.hadRuntimeError) process.exit(1)
        } catch (error) {
            console.log(error)
            console.error(chalk.red(`File not found at path '${path}'`))
        }
    }

    static runPrompt() {
        process.stdout.write('> ')

        const readline = createInterface({
            input: process.stdin,
        })

        readline.on('line', (line) => {
            const trimmedLine = line.trim()

            if (trimmedLine.length === 0) {
                console.error(chalk.red(`No input found`))
            } else {
                this.run(line)
                this.hadError = false
            }
            process.stdout.write('> ')
        })
    }
}

export default TesLang
