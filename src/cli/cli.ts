#! /usr/bin/env node

import chalk from 'chalk'
import run from '../index'

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

if (args.length === 0) {
    // prompt the user for input
    process.stdout.write('> ')

    process.stdin.on('data', (data: Buffer) => {
        const userInput = data.toString().trim()
        run(userInput)
    })
} else if (args.length === 1) {
    // read from file and evaluate

    throw new Error('No implementation found')
} else {
    console.info(chalk.hex('#83aaff')(`\tcommand: npm run cli <filepath>`))
}
