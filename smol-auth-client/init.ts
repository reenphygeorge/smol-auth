import { SmolClient } from "./types"

let __apiDomain: string

const smolClient: SmolClient = (apiDomain: string) => {
    __apiDomain = apiDomain
}

export { __apiDomain, smolClient }