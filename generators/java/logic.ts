import type {Block} from '../../core/block.js';
import type {JavaGenerator} from './java_generator.js';
import {Order} from './java_generator.js';

export function controls_if(block: Block, generator: JavaGenerator): string {
    let n = 0;
    let code = '';
    do {
        const conditionCode = generator.valueToCode(block, 'IF' + n, Order.NONE) || 'false';
        const branchCode = generator.statementToCode(block, 'DO' + n);
        code += (n > 0 ? ' else ' : '') + 'if (' + conditionCode + ') {\n' + branchCode + '}';
        n++;
    } while (block.getInput('IF' + n));

    if (block.getInput('ELSE')) {
        const elseCode = generator.statementToCode(block, 'ELSE');
        code += ' else {\n' + elseCode + '}';
    }

    return code + '\n';
}

export const controls_ifelse = controls_if;

export function logic_compare(block: Block, generator: JavaGenerator): [string, Order] {
    const OPERATORS: Record<string, [string, Order]> = {
        'EQ': ['==', Order.EQUALITY],
        'NEQ': ['!=', Order.EQUALITY],
        'LT': ['<', Order.RELATIONAL],
        'LTE': ['<=', Order.RELATIONAL],
        'GT': ['>', Order.RELATIONAL],
        'GTE': ['>=', Order.RELATIONAL],
    };
    const [operator, order] = OPERATORS[block.getFieldValue('OP')];
    const arg0 = generator.valueToCode(block, 'A', order) || '0';
    const arg1 = generator.valueToCode(block, 'B', order) || '0';
    return [`${arg0} ${operator} ${arg1}`, order];
}

export function logic_operation(block: Block, generator: JavaGenerator): [string, Order] {
    const operator = block.getFieldValue('OP') === 'AND' ? '&&' : '||';
    const order = operator === '&&' ? Order.LOGICAL_AND : Order.LOGICAL_OR;
    let arg0 = generator.valueToCode(block, 'A', order);
    let arg1 = generator.valueToCode(block, 'B', order);
    const defaultArg = operator === '&&' ? 'true' : 'false';
    if (!arg0 && !arg1) return ['false', order];
    if (!arg0) arg0 = defaultArg;
    if (!arg1) arg1 = defaultArg;
    return [`${arg0} ${operator} ${arg1}`, order];
}

export function logic_negate(block: Block, generator: JavaGenerator): [string, Order] {
    const arg = generator.valueToCode(block, 'BOOL', Order.LOGICAL_NOT) || 'true';
    return [`!${arg}`, Order.LOGICAL_NOT];
}

export function logic_boolean(block: Block): [string, Order] {
    const value = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
    return [value, Order.ATOMIC];
}

export function logic_null(): [string, Order] {
    return ['null', Order.ATOMIC];
}

export function logic_ternary(block: Block, generator: JavaGenerator): [string, Order] {
    const cond = generator.valueToCode(block, 'IF', Order.CONDITIONAL) || 'false';
    const thenVal = generator.valueToCode(block, 'THEN', Order.CONDITIONAL) || 'null';
    const elseVal = generator.valueToCode(block, 'ELSE', Order.CONDITIONAL) || 'null';
    return [`${cond} ? ${thenVal} : ${elseVal}`, Order.CONDITIONAL];
}
