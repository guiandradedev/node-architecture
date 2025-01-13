import { ErrMissingParam } from "../errors";

export async function validateInput(data: Record<string, any>, requiredFields: string[]) {
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
        throw new ErrMissingParam(missingFields.join(', '));
    }
}
