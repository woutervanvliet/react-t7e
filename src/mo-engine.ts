import Jed from 'jed'
import jedGettextParser from 'jed-gettext-parser'

type DomainMap = {
  [key: string]: ArrayBuffer,
}

export default class MoEngine {
    jed: any

    constructor(moData: ArrayBuffer, domain: string = 'messages', additionalDomains: DomainMap = {}) {
        const domains = {
            ...additionalDomains,
            [domain]: moData,
        }

        const localeData = Object.entries(domains)
            .reduce((result, [name, data]) => ({
                ...result,
                ...jedGettextParser.mo.parse(data, { domain: name }),
            }), {})

        this.jed = new Jed({
            locale_data: localeData,
            domain: 'messages',
        })
    }

    translate(
        source: string,
        sourcePlural?: string,
        count?: number,
        context?: string,
        domain?: string,
    ) {
        return this.jed.dcnpgettext(domain, context, source, sourcePlural, count)
    }
}
