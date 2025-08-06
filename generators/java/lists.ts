import type {Block} from '../../core/block.js';
import type {JavaGenerator} from './java_generator.js';
import {Order} from './java_generator.js';

export function lists_create_empty(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    return ['new ArrayList<>()', Order.ATOMIC];
}

export function lists_create_with(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const elements = [];
    const itemCount = (block as any).itemCount_ || 0;
    for (let i = 0; i < itemCount; i++) {
        elements.push(generator.valueToCode(block, 'ADD' + i, Order.NONE) || 'null');
    }
    const code = `new ArrayList<>(Arrays.asList(${elements.join(', ')}))`;
    return [code, Order.ATOMIC];
}

export function lists_repeat(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const element = generator.valueToCode(block, 'ITEM', Order.NONE) || 'null';
    const repeatCount = generator.valueToCode(block, 'NUM', Order.NONE) || '0';

    const functionName = generator.provideFunction_(
        'listsRepeat',
        `
public static List<Object> listsRepeat(Object value, int count) {
  List<Object> result = new ArrayList<>();
  for (int i = 0; i < count; i++) {
    result.add(value);
  }
  return result;
}
  `,
    );

    const code = `${functionName}(${element}, ${repeatCount})`;
    return [code, Order.FUNCTION_CALL];
}

export function lists_length(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const list = generator.valueToCode(block, 'VALUE', Order.MEMBER) || 'new ArrayList<>()';
    return [`${list}.size()`, Order.MEMBER];
}

export function lists_isEmpty(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const list = generator.valueToCode(block, 'VALUE', Order.MEMBER) || 'new ArrayList<>()';
    return [`${list}.isEmpty()`, Order.FUNCTION_CALL];
}

export function lists_indexOf(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const operator = block.getFieldValue('END') === 'FIRST' ? 'indexOf' : 'lastIndexOf';
    const item = generator.valueToCode(block, 'FIND', Order.NONE) || 'null';
    const list = generator.valueToCode(block, 'VALUE', Order.MEMBER) || 'new ArrayList<>()';
    let code = `${list}.${operator}(${item})`;
    if (block.workspace.options.oneBasedIndex) {
        code += ' + 1';
        return [code, Order.ADDITION];
    }
    return [code, Order.FUNCTION_CALL];
}

export function lists_getIndex(
    block: Block,
    generator: JavaGenerator,
): [string, Order] | string {
    const mode = block.getFieldValue('MODE') || 'GET';
    const where = block.getFieldValue('WHERE') || 'FROM_START';
    const list = generator.valueToCode(block, 'VALUE', Order.MEMBER) || 'new ArrayList<>()';

    const at = generator.getAdjusted(block, 'AT');

    switch (where) {
        case 'FIRST':
            if (mode === 'GET') return [`${list}.get(0)`, Order.MEMBER];
            if (mode === 'GET_REMOVE') return [`${list}.remove(0)`, Order.MEMBER];
            if (mode === 'REMOVE') return `${list}.remove(0);\n`;

        case 'LAST':
            if (mode === 'GET') return [`${list}.get(${list}.size() - 1)`, Order.FUNCTION_CALL];
            if (mode === 'GET_REMOVE') return [`${list}.remove(${list}.size() - 1)`, Order.FUNCTION_CALL];
            if (mode === 'REMOVE') return `${list}.remove(${list}.size() - 1);\n`;

        case 'FROM_START':
            if (mode === 'GET') return [`${list}.get(${at})`, Order.MEMBER];
            if (mode === 'GET_REMOVE') return [`${list}.remove(${at})`, Order.FUNCTION_CALL];
            if (mode === 'REMOVE') return `${list}.remove(${at});\n`;

        case 'FROM_END':
            const atEnd = generator.getAdjusted(block, 'AT', 1, true);
            if (mode === 'GET') return [`${list}.get(${list}.size() - 1 - ${atEnd})`, Order.FUNCTION_CALL];
            if (mode === 'GET_REMOVE') return [`${list}.remove(${list}.size() - 1 - ${atEnd})`, Order.FUNCTION_CALL];
            if (mode === 'REMOVE') return `${list}.remove(${list}.size() - 1 - ${atEnd});\n`;

        case 'RANDOM':
            const functionName = generator.provideFunction_(
                'listsGetRandomItem',
                `
public static Object listsGetRandomItem(List<Object> list, boolean remove) {
  int i = (int)(Math.random() * list.size());
  return remove ? list.remove(i) : list.get(i);
}
        `
            );
            const call = `${functionName}(${list}, ${mode !== 'GET'})`;
            if (mode === 'REMOVE') return call + ';\n';
            return [call, Order.FUNCTION_CALL];
    }

    throw Error('Unhandled combination (lists_getIndex).');
}

export function lists_setIndex(
    block: Block,
    generator: JavaGenerator,
): string {
    let list = generator.valueToCode(block, 'LIST', Order.MEMBER) || 'new ArrayList<>()';
    const mode = block.getFieldValue('MODE') || 'SET';
    const where = block.getFieldValue('WHERE') || 'FROM_START';
    const value = generator.valueToCode(block, 'TO', Order.ASSIGNMENT) || 'null';
    const at = generator.getAdjusted(block, 'AT');

    switch (where) {
        case 'FIRST':
            return mode === 'SET' ? `${list}.set(0, ${value});\n` : `${list}.add(0, ${value});\n`;

        case 'LAST':
            if (mode === 'SET') {
                return `${list}.set(${list}.size() - 1, ${value});\n`;
            } else {
                return `${list}.add(${value});\n`;
            }

        case 'FROM_START':
            return mode === 'SET'
                ? `${list}.set(${at}, ${value});\n`
                : `${list}.add(${at}, ${value});\n`;

        case 'FROM_END':
            const atEnd = generator.getAdjusted(block, 'AT', 1, true);
            const idx = `${list}.size() - 1 - ${atEnd}`;
            return mode === 'SET'
                ? `${list}.set(${idx}, ${value});\n`
                : `${list}.add(${idx}, ${value});\n`;

        case 'RANDOM':
            const randVar = generator.nameDB_!.getDistinctName('randIndex', 'VARIABLE');
            return `
int ${randVar} = (int)(Math.random() * ${list}.size());
${mode === 'SET' ? `${list}.set(${randVar}, ${value});` : `${list}.add(${randVar}, ${value});`}
      `;
    }

    throw Error('Unhandled combination (lists_setIndex).');
}

export function lists_getSublist(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const list = generator.valueToCode(block, 'LIST', Order.MEMBER) || 'new ArrayList<>()';
    const at1 = generator.getAdjusted(block, 'AT1');
    const at2 = generator.getAdjusted(block, 'AT2', 1);
    const code = `${list}.subList(${at1}, ${at2})`;
    return [code, Order.FUNCTION_CALL];
}

export function lists_sort(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const list = generator.valueToCode(block, 'LIST', Order.FUNCTION_CALL) || 'new ArrayList<>()';
    const direction = block.getFieldValue('DIRECTION') === '1' ? 'true' : 'false';
    const code = `new ArrayList<>(${list}).stream().sorted().collect(Collectors.toList())`;
    return [code, Order.FUNCTION_CALL];
}

export function lists_split(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const input = generator.valueToCode(block, 'INPUT', Order.MEMBER) || '""';
    const delim = generator.valueToCode(block, 'DELIM', Order.NONE) || '""';
    const mode = block.getFieldValue('MODE');

    const code = mode === 'SPLIT'
        ? `Arrays.asList(${input}.split(${delim}))`
        : `${input}.stream().collect(Collectors.joining(${delim}))`;

    return [code, Order.FUNCTION_CALL];
}

export function lists_reverse(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const list = generator.valueToCode(block, 'LIST', Order.FUNCTION_CALL) || 'new ArrayList<>()';
    const tempVar = generator.nameDB_!.getDistinctName('reversedList', 'VARIABLE');
    const code = `
List<Object> ${tempVar} = new ArrayList<>(${list});
Collections.reverse(${tempVar});
${tempVar}
  `.trim();
    return [code, Order.FUNCTION_CALL];
}
