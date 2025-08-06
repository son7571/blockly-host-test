import {JavaGenerator} from './java/java_generator.js';
import * as lists from './java/lists.js';
import * as logic from './java/logic.js';
import * as loops from './java/loops.js';
import * as math from './java/math.js';
import * as procedures from './java/procedures.js';
import * as text from './java/text.js';
import * as variables from './java/variables.js';
import * as variablesDynamic from './java/variables_dynamic.js';

export * from './java/java_generator.js';

/**
 * Java code generator instance.
 * @type {!JavaGenerator}
 */
export const javaGenerator = new JavaGenerator();

// Install per-block-type generator functions:
const generators: typeof javaGenerator.forBlock = {
    ...lists,
    ...logic,
    ...loops,
    ...math,
    ...procedures,
    ...text,
    ...variables,
    ...variablesDynamic,
};

for (const name in generators) {
    javaGenerator.forBlock[name] = generators[name];
}
