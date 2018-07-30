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
    ) {
      if (count === undefined) {
        if (context === undefined) {
          return this.jed.gettext(source);
        }

        return this.jed.pgettext(context, source);
      }

      if (context === undefined) {
        return this.jed.ngettext(source, sourcePlural, count);
      }

      return this.jed.npgettext(context, source, sourcePlural, count);
    }
}
