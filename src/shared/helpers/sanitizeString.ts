export class SanitizeString {
    private readonly specialChars: Record<string, string> = {
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
    sanitize(slug: string): string {
        let string = slug.toLowerCase();

        string = string.replace(/\s+/g, '-');

        string = string.replace(/[áãâàéêíóôõúüç]/g, match => this.specialChars[match] as string);

        return string;
    }
}