import TesLang from '../tes_lang/TesLang'
import Lexer from '../tes_lang/lexer/Lexer'

describe('Lexer Test', () => {
    describe('Source code has unterminated block comment', () => {
        it('Gives Unterminated comment', () => {
            const sourceCode = `/*
            *
            *
            *`
            const lexer = new Lexer(sourceCode)
            lexer.lex()
            expect(TesLang.hasLexicalError).toBe(true)
        })
    })
})
