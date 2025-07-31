import mongoose, { HydratedDocument, UpdateQuery } from 'mongoose';

function flattenObject(obj: any, prefix = ''): Record<string, any> {
    const flattened: Record<string, any> = {};

    Object.entries(obj).forEach(([key, value]) => {
        const keyPath = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(flattened, flattenObject(value, keyPath));
        } else if (value !== undefined) {
            flattened[keyPath] = value;
        }
    });

    return flattened;
}

export type OIDToString<T> = T extends mongoose.Types.ObjectId
    ? string
    : T extends (infer U)[]
      ? OIDToString<U>[]
      : T extends object
        ? { [K in keyof T]: OIDToString<T[K]> }
        : T;

export async function updateDocument<T>(
    Model: mongoose.Model<T>,
    id: string,
    updates: Partial<OIDToString<T>>
): Promise<HydratedDocument<T>> {
    const set: Record<string, any> = {};
    const unset: Record<string, any> = {};

    const flatUpdates = flattenObject(updates);

    Object.entries(flatUpdates).forEach(([key, value]) => {
        if (value === null) {
            unset[key] = '';
        } else {
            set[key] = value;
        }
    });

    const updateOperation: UpdateQuery<T> = {};
    if (Object.keys(set).length > 0) updateOperation.$set = set;
    if (Object.keys(unset).length > 0) updateOperation.$unset = unset;

    const result = await Model.findOneAndUpdate({ _id: id }, updateOperation, { new: true, runValidators: true });

    if (!result) throw new Error(`Document of type ${Model.modelName} with ID ${id} not found`);
    return result;
}

export function serializeRecursive(data: any): any {
    if (data === null || data === undefined) return data;

    if (data.toJSON) {
        return serializeRecursive(data.toJSON());
    }

    if (Array.isArray(data)) {
        return data.map(serializeRecursive);
    }

    if (typeof data === 'object') {
        const serialized: any = {};
        for (const [key, value] of Object.entries(data) as [string, any][]) {
            if (value === null || value === undefined) {
                serialized[key] = value;
            } else if (value instanceof mongoose.Types.ObjectId) {
                serialized[key] = value.toString();
                // } else if (typeof value === 'object' && value._id) {
                //     serialized[key] = value._id.toString();
            } else if (Array.isArray(value)) {
                serialized[key] = value.map(item => {
                    if (item === null || item === undefined) return item;
                    return item instanceof mongoose.Types.ObjectId ? item.toString() : serializeRecursive(item);
                });
            } else if (typeof value === 'object') {
                serialized[key] = serializeRecursive(value);
            } else {
                serialized[key] = value;
            }
        }
        return serialized;
    }

    return data;
}
