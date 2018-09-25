// @flow
import Jed from 'jed';
import jedGettextParser from 'jed-gettext-parser';

export default class MoEngine {
    jed: Jed;

    constructor(moData: ArrayBuffer, domain: string = 'messages') {
      const localeData = jedGettextParser.mo.parse(moData);
      this.jed = new Jed({
        locale_data: localeData,
        domain,
      });
    }

    translate(
      source: string,
      sourcePlural?: string,
      count?: number,
      context?: string,
      domain?: string,
    ) {
      return this.jed.dcnpgettext(domain, context, source, sourcePlural, count);
    }
}
