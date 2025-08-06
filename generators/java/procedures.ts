/**
 * @file Generating Java code for procedure blocks.
 */

import type {IfReturnBlock} from '../../blocks/procedures.js';
import type {Block} from '../../core/block.js';
import type {JavaGenerator} from './java_generator.js';
import {Order} from './java_generator.js';

export function procedures_defreturn(
    block: Block,
    generator: JavaGenerator,
) {
    const funcName = generator.getProcedureName(block.getFieldValue('NAME'));

    let branch = '';
    if (block.getInput('STACK')) {
        branch = generator.statementToCode(block, 'STACK');
    }

    let returnValue = '';
    if (block.getInput('RETURN')) {
        returnValue = generator.valueToCode(block, 'RETURN', Order.NONE) || '';
    }

    const args = [];
    const variables = block.getVars();
    for (let i = 0; i < variables.length; i++) {
        const argName = generator.getVariableName(variables[i]);
        args[i] = `Object ${argName}`; // Java에서는 타입 필요 (여기선 Object로 일괄 처리)
    }

    const returnType = returnValue ? 'Object' : 'void';
    const returnStmt = returnValue ? `\n    return ${returnValue};` : '';

    let code =
        `public static ${returnType} ${funcName}(` +
        args.join(', ') +
        `) {\n` +
        generator.prefixLines(branch, '    ') +
        returnStmt + '\n}';

    // % prefix는 중복 정의 방지용
    (generator as any).definitions_['%' + funcName] = code;
    return null;
}

export const procedures_defnoreturn = procedures_defreturn;

export function procedures_callreturn(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const funcName = generator.getProcedureName(block.getFieldValue('NAME'));
    const args = [];
    const variables = block.getVars();
    for (let i = 0; i < variables.length; i++) {
        args[i] = generator.valueToCode(block, 'ARG' + i, Order.NONE) || 'null';
    }
    const code = `${funcName}(${args.join(', ')})`;
    return [code, Order.FUNCTION_CALL];
}

export function procedures_callnoreturn(
    block: Block,
    generator: JavaGenerator,
) {
    const [code] = procedures_callreturn(block, generator);
    return code + ';\n';
}

export function procedures_ifreturn(
    block: Block,
    generator: JavaGenerator,
) {
    const condition =
        generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';

    let code = `if (${condition}) {\n`;

    if (generator.STATEMENT_SUFFIX) {
        code += generator.prefixLines(
            generator.injectId(generator.STATEMENT_SUFFIX, block),
            generator.INDENT,
        );
    }

    if ((block as IfReturnBlock).hasReturnValue_) {
        const value = generator.valueToCode(block, 'VALUE', Order.NONE) || 'null';
        code += `    return ${value};\n`;
    } else {
        code += `    return;\n`;
    }

    code += '}\n';
    return code;
}
