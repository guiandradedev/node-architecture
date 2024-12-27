export class GenerateSlug {
    generate(slug: string): string {
        return slug.split(' ').join('-')
    }
}