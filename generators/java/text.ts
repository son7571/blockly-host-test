import type {Block} from '../../core/block.js';
import type {JavaGenerator} from './java_generator.js';
import {Order} from './java_generator.js';

export function controls_if(block: Block, generator: JavaGenerator): string {
    let n = 0;
    let code = '';
    do {
        const conditionCode =
            generator.valueToCode(block, 'IF' + n, Order.NONE) || 'false';
        let branchCode = generator.statementToCode(block, 'DO' + n);
        code +=
            (n > 0 ? ' else ' : '') +
            'if (' + conditionCode + ') {\n' +
            branchCode +
            '}';
        n++;
    } while (block.getInput('IF' + n));

    if (block.getInput('ELSE')) {
        let branchCode = generator.statementToCode(block, 'ELSE');
        code += ' else {\n' + branchCode + '}';
    }

    return code + '\n';
}

export const controls_ifelse = controls_if;

export function logic_compare(block: Block, generator: JavaGenerator): [string, Order] {
    const OPERATORS = {
        'EQ': '==',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>='
    };
    const operator = OPERATORS[block.getFieldValue('OP') as keyof typeof OPERATORS];
    const order = (operator === '==' || operator === '!=') ? Order.EQUALITY : Order.RELATIONAL;
    const argument0 = generator.valueToCode(block, 'A', order) || '0';
    const argument1 = generator.valueToCode(block, 'B', order) || '0';
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
}

export function logic_operation(block: Block, generator: JavaGenerator): [string, Order] {
    const operator = block.getFieldValue('OP') === 'AND' ? '&&' : '||';
    const order = operator === '&&' ? Order.LOGICAL_AND : Order.LOGICAL_OR;
    let argument0 = generator.valueToCode(block, 'A', order);
    let argument1 = generator.valueToCode(block, 'B', order);

    if (!argument0 && !argument1) {
        argument0 = 'false';
        argument1 = 'false';
    } else {
        const defaultArgument = operator === '&&' ? 'true' : 'false';
        if (!argument0) argument0 = defaultArgument;
        if (!argument1) argument1 = defaultArgument;
    }

    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
}

export function logic_negate(block: Block, generator: JavaGenerator): [string, Order] {
    const order = Order.LOGICAL_NOT;
    const argument0 = generator.valueToCode(block, 'BOOL', order) || 'true';
    const code = '!' + argument0;
    return [code, order];
}

export function logic_boolean(block: Block, generator: JavaGenerator): [string, Order] {
    const code = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
    return [code, Order.ATOMIC];
}

export function logic_null(block: Block, generator: JavaGenerator): [string, Order] {
    return ['null', Order.ATOMIC];
}

export function logic_ternary(block: Block, generator: JavaGenerator): [string, Order] {
    const value_if = generator.valueToCode(block, 'IF', Order.CONDITIONAL) || 'false';
    const value_then = generator.valueToCode(block, 'THEN', Order.CONDITIONAL) || 'null';
    const value_else = generator.valueToCode(block, 'ELSE', Order.CONDITIONAL) || 'null';
    const code = value_if + ' ? ' + value_then + ' : ' + value_else;
    return [code, Order.CONDITIONAL];
}
