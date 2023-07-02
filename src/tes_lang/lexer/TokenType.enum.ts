export enum TokenKind {
    // Grouping and scope
    LEFT_PAREN = 'LEFT_PAREN',
    RIGHT_PAREN = 'RIGHT_PAREN',
    LEFT_BRACE = 'LEFT_BRACE',
    RIGHT_BRACE = 'RIGHT_BRACE',

    // Delimeters
    COMMA = 'COMMA',
    SEMICOLON = 'SEMICOLON',

    // Arithmetic Operators
    MINUS = 'MINUS',
    PLUS = 'PLUS',
    SLASH = 'SLASH',
    STAR = 'STAR',
    MODULO = 'MODULO',

    // Relational Operators
    BANG = 'BANG',
    BANG_EQUAL = 'BANG_EQUAL',
    EQUAL = 'EQUAL',
    EQUAL_EQUAL = 'EQUAL_EQUAL',
    GREATER = 'GREATER',
    GREATER_EQUAL = 'GREATER_EQUAL',
    LESS = 'LESS',
    LESS_EQUAL = 'LESS_EQUAL',

    // Logical operators
    AND = 'AND',
    OR = 'OR',

    // Literals
    IDENTIFIER = 'IDENTIFIER',
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    TRUE = 'TRUE',
    FALSE = 'FALSE',
    NIL = 'NIL',

    // Control flow
    IF = 'IF',
    ELSE = 'ELSE',
    CONTINUE = 'CONTINUE',
    BREAK = 'BREAK',
    RETURN = 'RETURN',

    // Loop
    FOR = 'FOR',
    WHILE = 'WHILE',

    // others
    VAR = 'VAR',
    FUN = 'FUN',
    PRINT = 'PRINT',
    PRINTLN = 'PRINTLN',

    // Special token
    EOF = 'EOF',
}

export type TypeTokenKind = keyof typeof TokenKind
