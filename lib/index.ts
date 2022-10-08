import graphqlFields = require("graphql-fields");

const setFields = (data: Record<string, unknown>) => {
    const fields = [];
    for (const key in data) {
        const isObject = typeof data[key] === 'object';
        const isNotEmpty = isObject && Object.keys(data[key]).length > 0;
        if (isNotEmpty) {
            fields[key] = setFields(data[key] as unknown as any);
        } else {
            fields.push(key);
        }
    }
    return fields;
}

/**
 * 
 * @param info 
 * @returns ['field.subfield', 'field']
 */
const filterGraphqlFields = (info: unknown): Array<string> => {
    const graphqlData = (graphqlFields(info as any) as unknown as Record<string, unknown>);
    const fields = setFields(graphqlData);
    Object.keys(fields).forEach(field => {
        if (Array.isArray(fields[field])) {
            const list: string[] = fields[field] as any[];
            list.forEach((key) => {
                fields.push(`${field}.${key}`);
            });
            delete fields[field];
        }
    });
    return fields;
}
export default filterGraphqlFields;
