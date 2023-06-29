import * as fs from 'fs'
import chalk from 'chalk'
import TesLang from './tes_lang/TesLang'

const init = () => {
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
        console.info(chalk.hex('#83aaff')(`\tcommand: npm start <filepath>`))
        return process.exit(0)
    }

    if (args.length === 1) {
        const path = args[0]
        try {
            if (path.indexOf('.tes') === -1) {
                console.error(chalk.red(`Invalid file extension`))
            } else {
                const sourceCode = fs.readFileSync(path, 'utf8').trimEnd()
                TesLang.run(sourceCode)

                if (
                    TesLang.hasLexicalError ||
                    TesLang.hasParserError ||
                    TesLang.hasInterpreterError
                ) {
                    return console.error(chalk.red(TesLang.error))
                }

                console.log(TesLang.output)
                process.exit(0)
            }
        } catch (error) {
            console.error(chalk.red(`File not found at path '${path}'`))
            process.exit(1)
        }
    }

    if (args.length === 0) {
        const code = `
        print 1 + 2.4;
        `
        TesLang.run(code)

        if (
            TesLang.hasLexicalError ||
            TesLang.hasParserError ||
            TesLang.hasInterpreterError
        ) {
            return console.error(TesLang.error)
        }

        console.log(TesLang.output)
    }

    return null
}

init()
