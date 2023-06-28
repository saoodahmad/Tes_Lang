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
        return TesLang.runFile(args[0])
    }
    if (args.length === 0) {
        const code = `
        print 1;
        print "one";
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
