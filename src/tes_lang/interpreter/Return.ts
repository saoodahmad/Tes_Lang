export default class Return extends Error {
    returnValue: unknown

    constructor(returnValue: unknown) {
        super()
        this.returnValue = returnValue
    }
}
