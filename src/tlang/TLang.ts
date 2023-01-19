import chalk from 'chalk'
import * as fs from 'fs'
import { createInterface } from 'readline'
import Lexer from './lexer/Lexer'
import Token from './lexer/Token'

class TLang {
    static hadError = false

    static main(): void {
        console.info(
            chalk.hex('#83aaff')(`
            ████████╗██╗░░░░░░█████╗░███╗░░██╗░██████╗░
            ╚══██╔══╝██║░░░░░██╔══██╗████╗░██║██╔════╝░
            ░░░██║░░░██║░░░░░███████║██╔██╗██║██║░░██╗░
            ░░░██║░░░██║░░░░░██╔══██║██║╚████║██║░░╚██╗
            ░░░██║░░░███████╗██║░░██║██║░╚███║╚██████╔╝
            ░░░╚═╝░░░╚══════╝╚═╝░░╚═╝╚═╝░░╚══╝░╚═════╝░
                https://github.com/saoodahmad/TLang
          `)
        )

        const args: string[] = process.argv.slice(2)

        if (args.length > 1) {
            console.info(
                chalk.hex('#83aaff')(`\tcommand: npm run cli <filepath>`)
            )
            process.exit(65)
        } else if (args.length === 1) {
            this.runFile(args[0])
        } else {
            this.runPrompt()
        }
    }

    static report(line: number, where: string, message: string) {
        console.error(chalk.red(`[Line ${line}] Error ${where}: ${message}`))
    }

    static error(line: number, message: string) {
        this.report(line, '', message)
        this.hadError = true
    }

    static run(source: string) {
        const lexer: Lexer = new Lexer(source)

        const tokens: Array<Token> = lexer.lex()

        if (this.hadError) return

        tokens.forEach((token) => {
            console.log(token.toString())
        })
    }

    static runFile(path: string) {
        try {
            const sourceCode = fs.readFileSync(path, 'utf8')
            this.run(sourceCode)

            if (this.hadError) {
                process.exit(65)
            }
        } catch (error) {
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

export default TLang
