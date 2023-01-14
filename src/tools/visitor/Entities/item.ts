import Visitor from '../tax/Vistor'

interface Item {
    accept(visitor: Visitor): number
}

export default Item
