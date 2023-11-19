let __apiDomain: string

const smolClient = (apiDomain: string) => {
    __apiDomain = apiDomain
}

export { __apiDomain, smolClient }