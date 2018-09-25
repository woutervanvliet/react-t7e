import * as React from 'react'

declare interface TranslateEngine {
    translate(source: string, sourcePlural?: string, count?: number, context?: string, domain?: string): string;
}

declare type TranslationProviderProps = {
    engine: TranslateEngine,
    children: React.ReactNode
}
declare type Replacements = {
    [key: string]: string | number,
}

declare type TranslateProps = {
    source: string,
    sourcePlural?: string,
    count?: number,
    context?: string,
    replacements?: Replacements,
    domain?: string,
}

export declare const Consumer: React.ComponentType<React.ConsumerProps<TranslateEngine>>;

export declare function TranslationProvider(props: TranslationProviderProps): JSX.Element
export declare class MoEngine {
    constructor(moData: ArrayBuffer, domain?: string);
    translate(source: string, sourcePlural?: string, count?: number, context?: string, domain?: string)
}

export declare class T extends React.PureComponent<TranslateProps> {
    render(): JSX.Element
}

export declare function withTextDomain(domain: string): <P>(Component: React.ComponentType<P>)
    => React.ComponentType<P>

export declare function _(
    source: string,
    context?: string,
    replacements?: Replacements,
    domain?: string,
): JSX.Element
export declare function _n(
    singularSource: string,
    pluralSource: string,
    count: number,
    context?: string,
    replacements?: Replacements,
    domain?: string,
): JSX.Element

