import type {Block} from '../../core/block.js';
import {NameType} from '../../core/names.js';
import * as stringUtils from '../../core/utils/string.js';
import type {JavaGenerator} from './java_generator.js';
import {Order} from './java_generator.js';

export function controls_repeat_ext(
    block: Block,
    generator: JavaGenerator,
) {
    let repeats;
    if (block.getField('TIMES')) {
        repeats = String(Number(block.getFieldValue('TIMES')));
    } else {
        repeats = generator.valueToCode(block, 'TIMES', Order.ASSIGNMENT) || '0';
    }

    let branch = generator.statementToCode(block, 'DO');
    branch = generator.addLoopTrap(branch, block);
    let code = '';
    const loopVar = generator.nameDB_!.getDistinctName('count', NameType.VARIABLE);
    let endVar = repeats;

    if (!repeats.match(/^\w+$/) && !stringUtils.isNumber(repeats)) {
        endVar = generator.nameDB_!.getDistinctName('repeat_end', NameType.VARIABLE);
        code += 'int ' + endVar + ' = ' + repeats + ';\n';
    }

    code +=
        'for (int ' +
        loopVar +
        ' = 0; ' +
        loopVar +
        ' < ' +
        endVar +
        '; ' +
        loopVar +
        '++) {\n' +
        branch +
        '}\n';
    return code;
}

export const controls_repeat = controls_repeat_ext;

export function controls_whileUntil(
    block: Block,
    generator: JavaGenerator,
) {
    const until = block.getFieldValue('MODE') === 'UNTIL';
    let argument0 =
        generator.valueToCode(block, 'BOOL', until ? Order.LOGICAL_NOT : Order.NONE) || 'false';
    let branch = generator.statementToCode(block, 'DO');
    branch = generator.addLoopTrap(branch, block);
    if (until) {
        argument0 = '!' + argument0;
    }
    return 'while (' + argument0 + ') {\n' + branch + '}\n';
}

export function controls_for(block: Block, generator: JavaGenerator) {
    const variable0 = generator.getVariableName(block.getFieldValue('VAR'));
    const argument0 = generator.valueToCode(block, 'FROM', Order.ASSIGNMENT) || '0';
    const argument1 = generator.valueToCode(block, 'TO', Order.ASSIGNMENT) || '0';
    const increment = generator.valueToCode(block, 'BY', Order.ASSIGNMENT) || '1';
    let branch = generator.statementToCode(block, 'DO');
    branch = generator.addLoopTrap(branch, block);

    let code = '';
    if (
        stringUtils.isNumber(argument0) &&
        stringUtils.isNumber(argument1) &&
        stringUtils.isNumber(increment)
    ) {
        const up = Number(argument0) <= Number(argument1);
        const step = Math.abs(Number(increment));
        code =
            'for (int ' +
            variable0 +
            ' = ' +
            argument0 +
            '; ' +
            variable0 +
            (up ? ' <= ' : ' >= ') +
            argument1 +
            '; ' +
            variable0 +
            (step === 1 ? (up ? '++' : '--') : (up ? ' += ' : ' -= ') + step) +
            ') {\n' +
            branch +
            '}\n';
    } else {
        let startVar = argument0;
        if (!argument0.match(/^\w+$/) && !stringUtils.isNumber(argument0)) {
            startVar = generator.nameDB_!.getDistinctName(variable0 + '_start', NameType.VARIABLE);
            code += 'int ' + startVar + ' = ' + argument0 + ';\n';
        }

        let endVar = argument1;
        if (!argument1.match(/^\w+$/) && !stringUtils.isNumber(argument1)) {
            endVar = generator.nameDB_!.getDistinctName(variable0 + '_end', NameType.VARIABLE);
            code += 'int ' + endVar + ' = ' + argument1 + ';\n';
        }

        const incVar = generator.nameDB_!.getDistinctName(variable0 + '_inc', NameType.VARIABLE);
        code += 'int ' + incVar + ' = ';
        code += stringUtils.isNumber(increment)
            ? Math.abs(Number(increment)) + ';\n'
            : 'Math.abs(' + increment + ');\n';

        code += 'if (' + startVar + ' > ' + endVar + ') {\n';
        code += generator.INDENT + incVar + ' = -' + incVar + ';\n';
        code += '}\n';

        code +=
            'for (int ' +
            variable0 +
            ' = ' +
            startVar +
            '; ' +
            incVar +
            ' >= 0 ? ' +
            variable0 +
            ' <= ' +
            endVar +
            ' : ' +
            variable0 +
            ' >= ' +
            endVar +
            '; ' +
            variable0 +
            ' += ' +
            incVar +
            ') {\n' +
            branch +
            '}\n';
    }
    return code;
}

export function controls_forEach(block: Block, generator: JavaGenerator) {
    const variable0 = generator.getVariableName(block.getFieldValue('VAR'));
    const argument0 = generator.valueToCode(block, 'LIST', Order.ASSIGNMENT) || 'new ArrayList<>()';
    let branch = generator.statementToCode(block, 'DO');
    branch = generator.addLoopTrap(branch, block);
    const listVar =
        !argument0.match(/^\w+$/) && !stringUtils.isNumber(argument0)
            ? generator.nameDB_!.getDistinctName(variable0 + '_list', NameType.VARIABLE)
            : argument0;

    let code = '';
    if (listVar !== argument0) {
        code += 'List<Object> ' + listVar + ' = ' + argument0 + ';\n';
    }

    code += 'for (Object ' + variable0 + ' : ' + listVar + ') {\n' + branch + '}\n';
    return code;
}

export function controls_flow_statements(block: Block, generator: JavaGenerator) {
    let xfix = '';
    if (generator.STATEMENT_PREFIX) {
        xfix += generator.injectId(generator.STATEMENT_PREFIX, block);
    }
    if (generator.STATEMENT_SUFFIX) {
        xfix += generator.injectId(generator.STATEMENT_SUFFIX, block);
    }
    if (generator.STATEMENT_PREFIX) {
        const loop = (block as any).getSurroundLoop?.();
        if (loop && !loop.suppressPrefixSuffix) {
            xfix += generator.injectId(generator.STATEMENT_PREFIX, loop);
        }
    }

    switch (block.getFieldValue('FLOW')) {
        case 'BREAK':
            return xfix + 'break;\n';
        case 'CONTINUE':
            return xfix + 'continue;\n';
        default:
            throw new Error('Unknown flow statement.');
    }
}
