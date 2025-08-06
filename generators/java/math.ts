import type {Block} from '../../core/block.js';
import type {JavaGenerator} from './java_generator.js';
import {Order} from './java_generator.js';

export function math_number(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const number = Number(block.getFieldValue('NUM'));
    const order = number >= 0 ? Order.ATOMIC : Order.UNARY_NEGATION;
    return [String(number), order];
}

export function math_arithmetic(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const OPERATORS: Record<string, [string | null, Order]> = {
        'ADD': [' + ', Order.ADDITION],
        'MINUS': [' - ', Order.SUBTRACTION],
        'MULTIPLY': [' * ', Order.MULTIPLICATION],
        'DIVIDE': [' / ', Order.DIVISION],
        'POWER': [null, Order.NONE],
    };
    type OperatorOption = keyof typeof OPERATORS;
    const [operator, order] = OPERATORS[block.getFieldValue('OP') as OperatorOption];
    const argument0 = generator.valueToCode(block, 'A', order) || '0';
    const argument1 = generator.valueToCode(block, 'B', order) || '0';
    let code;
    if (!operator) {
        code = `Math.pow(${argument0}, ${argument1})`;
        return [code, Order.FUNCTION_CALL];
    }
    code = `${argument0}${operator}${argument1}`;
    return [code, order];
}


export function math_single(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const operator = block.getFieldValue('OP');
    let code: string;
    let arg: string;

    if (operator === 'NEG') {
        arg = generator.valueToCode(block, 'NUM', Order.UNARY_NEGATION) || '0';
        if (arg.startsWith('-')) {
            arg = ' ' + arg;
        }
        code = '-' + arg;
        return [code, Order.UNARY_NEGATION];
    }

    if (['SIN', 'COS', 'TAN'].includes(operator)) {
        arg = `Math.toRadians(${generator.valueToCode(block, 'NUM', Order.NONE) || '0'})`;
    } else {
        arg = generator.valueToCode(block, 'NUM', Order.NONE) || '0';
    }

    switch (operator) {
        case 'ABS':
            code = `Math.abs(${arg})`;
            break;
        case 'ROOT':
            code = `Math.sqrt(${arg})`;
            break;
        case 'LN':
            code = `Math.log(${arg})`;
            break;
        case 'EXP':
            code = `Math.exp(${arg})`;
            break;
        case 'POW10':
            code = `Math.pow(10, ${arg})`;
            break;
        case 'ROUND':
            code = `Math.round(${arg})`;
            break;
        case 'ROUNDUP':
            code = `Math.ceil(${arg})`;
            break;
        case 'ROUNDDOWN':
            code = `Math.floor(${arg})`;
            break;
        case 'SIN':
            code = `Math.sin(${arg})`;
            break;
        case 'COS':
            code = `Math.cos(${arg})`;
            break;
        case 'TAN':
            code = `Math.tan(${arg})`;
            break;
        default:
            throw Error('Unknown math operator: ' + operator);
    }
    return [code, Order.FUNCTION_CALL];
}

export function math_constant(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const CONSTANTS: Record<string, [string, Order]> = {
        'PI': ['Math.PI', Order.ATOMIC],
        'E': ['Math.E', Order.ATOMIC],
        'GOLDEN_RATIO': ['(1 + Math.sqrt(5)) / 2', Order.DIVISION],
        'SQRT2': ['Math.sqrt(2)', Order.FUNCTION_CALL],
        'SQRT1_2': ['Math.sqrt(0.5)', Order.FUNCTION_CALL],
        'INFINITY': ['Double.POSITIVE_INFINITY', Order.ATOMIC],
    };
    type ConstantOption = keyof typeof CONSTANTS;
    return CONSTANTS[block.getFieldValue('CONSTANT') as ConstantOption];
}

export function math_number_property(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const dropdownProperty = block.getFieldValue('PROPERTY');
    const numberToCheck = generator.valueToCode(block, 'NUMBER_TO_CHECK', Order.NONE) || '0';
    let code: string;

    switch (dropdownProperty) {
        case 'EVEN':
            code = `${numberToCheck} % 2 == 0`;
            break;
        case 'ODD':
            code = `${numberToCheck} % 2 == 1`;
            break;
        case 'WHOLE':
            code = `${numberToCheck} % 1 == 0`;
            break;
        case 'POSITIVE':
            code = `${numberToCheck} > 0`;
            break;
        case 'NEGATIVE':
            code = `${numberToCheck} < 0`;
            break;
        case 'DIVISIBLE_BY':
            const divisor = generator.valueToCode(block, 'DIVISOR', Order.NONE) || '1';
            code = `${numberToCheck} % ${divisor} == 0`;
            break;
        case 'PRIME':
            const functionName = generator.provideFunction_(
                'isPrime',
                `
public static boolean ${generator.FUNCTION_NAME_PLACEHOLDER_}(int n) {
  if (n <= 1) return false;
  if (n == 2 || n == 3) return true;
  if (n % 2 == 0 || n % 3 == 0) return false;
  for (int i = 5; i * i <= n; i += 6) {
    if (n % i == 0 || n % (i + 2) == 0) return false;
  }
  return true;
}`);
            code = `${functionName}(${numberToCheck})`;
            break;
        default:
            throw Error('Unknown property: ' + dropdownProperty);
    }

    return [code, Order.RELATIONAL];
}


export function math_change(block: Block, generator: JavaGenerator): string {
    const delta = generator.valueToCode(block, 'DELTA', Order.ADDITION) || '0';
    const varName = generator.getVariableName(block.getFieldValue('VAR'));
    return `${varName} = ${varName} + ${delta};\n`;
}

export function math_modulo(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const a = generator.valueToCode(block, 'DIVIDEND', Order.MODULUS) || '0';
    const b = generator.valueToCode(block, 'DIVISOR', Order.MODULUS) || '1';
    return [`${a} % ${b}`, Order.MODULUS];
}

export function math_constrain(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const val = generator.valueToCode(block, 'VALUE', Order.NONE) || '0';
    const low = generator.valueToCode(block, 'LOW', Order.NONE) || '0';
    const high = generator.valueToCode(block, 'HIGH', Order.NONE) || '100';
    return [`Math.min(Math.max(${val}, ${low}), ${high})`, Order.FUNCTION_CALL];
}

export function math_random_int(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const from = generator.valueToCode(block, 'FROM', Order.NONE) || '0';
    const to = generator.valueToCode(block, 'TO', Order.NONE) || '100';
    const functionName = generator.provideFunction_('randomInt', `
public static int ${generator.FUNCTION_NAME_PLACEHOLDER_}(int a, int b) {
  if (a > b) { int temp = a; a = b; b = temp; }
  return (int)(Math.random() * (b - a + 1)) + a;
}`);
    return [`${functionName}(${from}, ${to})`, Order.FUNCTION_CALL];
}

export function math_random_float(): [string, Order] {
    return ['Math.random()', Order.FUNCTION_CALL];
}

export function math_atan2(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const x = generator.valueToCode(block, 'X', Order.NONE) || '0';
    const y = generator.valueToCode(block, 'Y', Order.NONE) || '0';
    return [`Math.toDegrees(Math.atan2(${y}, ${x}))`, Order.FUNCTION_CALL];
}


export function math_on_list(
    block: Block,
    generator: JavaGenerator,
): [string, Order] {
    const func = block.getFieldValue('OP');
    const list = generator.valueToCode(block, 'LIST', Order.NONE) || 'new ArrayList<>()';
    let code: string;

    switch (func) {
        case 'SUM':
            const sumFn = generator.provideFunction_('listSum', `
public static double ${generator.FUNCTION_NAME_PLACEHOLDER_}(List<Double> list) {
  return list.stream().mapToDouble(Double::doubleValue).sum();
}`);
            code = `${sumFn}(${list})`;
            break;
        case 'MIN':
            code = `Collections.min(${list})`;
            break;
        case 'MAX':
            code = `Collections.max(${list})`;
            break;
        case 'AVERAGE':
            const avgFn = generator.provideFunction_('listAverage', `
public static double ${generator.FUNCTION_NAME_PLACEHOLDER_}(List<Double> list) {
  return list.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
}`);
            code = `${avgFn}(${list})`;
            break;
        case 'MEDIAN':
            const medFn = generator.provideFunction_('listMedian', `
public static double ${generator.FUNCTION_NAME_PLACEHOLDER_}(List<Double> list) {
  List<Double> sorted = new ArrayList<>(list);
  sorted.sort(Double::compareTo);
  int n = sorted.size();
  if (n == 0) return 0;
  if (n % 2 == 1) return sorted.get(n / 2);
  return (sorted.get(n / 2 - 1) + sorted.get(n / 2)) / 2.0;
}`);
            code = `${medFn}(${list})`;
            break;
        case 'STD_DEV':
            const devFn = generator.provideFunction_('listStdDev', `
public static double ${generator.FUNCTION_NAME_PLACEHOLDER_}(List<Double> list) {
  int n = list.size();
  if (n == 0) return 0;
  double mean = list.stream().mapToDouble(Double::doubleValue).sum() / n;
  double variance = list.stream().mapToDouble(d -> Math.pow(d - mean, 2)).sum() / n;
  return Math.sqrt(variance);
}`);
            code = `${devFn}(${list})`;
            break;
        case 'RANDOM':
            const randFn = generator.provideFunction_('randomItem', `
public static <T> T ${generator.FUNCTION_NAME_PLACEHOLDER_}(List<T> list) {
  if (list.isEmpty()) return null;
  return list.get((int)(Math.random() * list.size()));
}`);
            code = `${randFn}(${list})`;
            break;
        default:
            throw Error('Unknown math_on_list operator: ' + func);
    }

    return [code, Order.FUNCTION_CALL];
}