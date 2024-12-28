export class GenerateSlug {
    generate(slug: string): string {
        let string = slug.toLowerCase();

        string = string.replace(/\s+/g, '-');

        const caracteresEspeciais: Record<string, string> = {
            'á': 'a',
            'ã': 'a',
            'â': 'a',
            'à': 'a',
            'é': 'e',
            'ê': 'e',
            'í': 'i',
            'ó': 'o',
            'ô': 'o',
            'õ': 'o',
            'ú': 'u',
            'ü': 'u',
            'ç': 'c',
            '`': '',
            '\'': '',
        };

        string = string.replace(/[áãâàéêíóôõúüç]/g, match => caracteresEspeciais[match] as string);

        return string;
    }
}