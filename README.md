# Tes Lang

Tes is dynamically typed interpreted object oriented programming language written in typescript

## Grammar

```js
expression → literal
| unary
| binary
| grouping ;

literal → NUMBER | STRING | "true" | "false" | "nil" ;

grouping → "(" expression ")" ;

unary → ( "-" | "!" ) expression ;

binary → expression operator expression ;

operator → "==" | "!=" | "<" | "<=" | ">" | ">="
| "+" | "-" | "\*" | "/" ;
```
