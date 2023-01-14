#! /usr/bin/env node

import chalk from 'chalk'
import * as fs from 'fs'
import { createInterface } from 'readline'
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
    process.stdout.write('> ')

    const readline = createInterface({
        input: process.stdin,
    })

    readline.on('line', (line) => {
        run(line)
    })
} else if (args.length === 1) {
    try {
        const sourceCode = fs.readFileSync(args[0], 'utf8')
        run(sourceCode)
    } catch (error) {
        console.error(chalk.red(`File not found at path ${args[0]}`))
    }
} else {
    console.info(chalk.hex('#83aaff')(`\tcommand: npm run cli <filepath>`))
}
