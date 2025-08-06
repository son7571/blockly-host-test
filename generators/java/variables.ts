import type {Block} from '../../core/block.js';
import type {JavaGenerator} from './java_generator.js';
import {Order} from './java_generator.js';

export function variables_get(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    // Variable getter.
    const code = generator.getVariableName(block.getFieldValue('VAR'));
    return [code, Order.ATOMIC];
}

export function variables_set(
    block: Block,
    generator: JavaGenerator,
): string {
    // Variable setter.
    const argument0 = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';
    const varName = generator.getVariableName(block.getFieldValue('VAR'));
    return `${varName} = ${argument0};\n`;
}
