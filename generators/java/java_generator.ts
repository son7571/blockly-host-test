import type {Block} from '../../core/block.js';
import {CodeGenerator} from '../../core/generator.js';
import {inputTypes} from '../../core/inputs/input_types.js';
import {Names, NameType} from '../../core/names.js';
import * as stringUtils from '../../core/utils/string.js';
import * as Variables from '../../core/variables.js';
import type {Workspace} from '../../core/workspace.js';

export enum Order {
    ATOMIC = 0,             // 숫자, 변수
    MEMBER = 1,             // list.size()
    FUNCTION_CALL = 2,      // 함수 호출 f(x)
    MODULUS = 3,            // %
    DIVISION = 3,           // /
    MULTIPLICATION = 3,     // *
    ADDITION = 4,           // +
    SUBTRACTION = 4,        // -
    UNARY_NEGATION = 5,     // -x
    RELATIONAL = 6,         // <, >, <=, >=
    EQUALITY = 7,           // ==, !=
    LOGICAL_NOT = 8,        // !
    LOGICAL_AND = 9,        // &&
    LOGICAL_OR = 10,        // ||
    CONDITIONAL = 11,       // 삼항 연산자 ?:
    ASSIGNMENT = 12,        // =
    NONE = 99,              // 우선순위 없음
}

export class JavaGenerator extends CodeGenerator {
    ORDER_OVERRIDES: [Order, Order][] = [
        [Order.ADDITION, Order.ADDITION],
        [Order.MULTIPLICATION, Order.MULTIPLICATION],
    ];

    constructor(name = 'Java') {
        super(name);
        this.isInitialized = false;

        for (const key in Order) {
            const value = Order[key];
            if (typeof value === 'string') continue;
            (this as any)['ORDER_' + key] = value;
        }

        this.addReservedWords(
            'abstract,assert,boolean,break,byte,case,catch,char,class,const,' +
            'continue,default,do,double,else,enum,extends,final,finally,float,' +
            'for,goto,if,implements,import,instanceof,int,interface,long,native,' +
            'new,package,private,protected,public,return,short,static,strictfp,' +
            'super,switch,synchronized,this,throw,throws,transient,try,void,volatile,while'
        );
    }

    init(workspace: Workspace) {
        super.init(workspace);
        if (!this.nameDB_) {
            this.nameDB_ = new Names(this.RESERVED_WORDS_);
        } else {
            this.nameDB_.reset();
        }

        this.nameDB_.setVariableMap(workspace.getVariableMap());
        this.nameDB_.populateVariables(workspace);
        this.nameDB_.populateProcedures(workspace);

        const defvars = [];
        const devVarList = Variables.allDeveloperVariables(workspace);
        for (let i = 0; i < devVarList.length; i++) {
            defvars.push(this.nameDB_.getName(devVarList[i], NameType.DEVELOPER_VARIABLE));
        }

        const variables = Variables.allUsedVarModels(workspace);
        for (let i = 0; i < variables.length; i++) {
            defvars.push(this.nameDB_.getName(variables[i].getId(), NameType.VARIABLE));
        }

        if (defvars.length) {
            this.definitions_['variables'] = 'int ' + defvars.join(', ') + ';';
        }

        this.isInitialized = true;
    }

    finish(code: string): string {
        const definitions = Object.values(this.definitions_);
        super.finish(code);
        this.isInitialized = false;
        this.nameDB_!.reset();
        return definitions.join('\n\n') + '\n\n' + code;
    }

    scrubNakedValue(line: string): string {
        return line + ';\n';
    }

    quote_(text: string): string {
        text = text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\"');
        return `"${text}"`;
    }

    multiline_quote_(text: string): string {
        const lines = text.split(/\n/g).map(this.quote_);
        return lines.join(' + "\\n" +\n');
    }

    scrub_(block: Block, code: string, thisOnly = false): string {
        let commentCode = '';
        if (!block.outputConnection || !block.outputConnection.targetConnection) {
            let comment = block.getCommentText();
            if (comment) {
                comment = stringUtils.wrap(comment, this.COMMENT_WRAP - 3);
                commentCode += this.prefixLines(comment + '\n', '// ');
            }

            for (let i = 0; i < block.inputList.length; i++) {
                if (block.inputList[i].type === inputTypes.VALUE) {
                    const childBlock = block.inputList[i].connection!.targetBlock();
                    if (childBlock) {
                        comment = this.allNestedComments(childBlock);
                        if (comment) {
                            commentCode += this.prefixLines(comment, '// ');
                        }
                    }
                }
            }
        }

        const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
        const nextCode = thisOnly ? '' : this.blockToCode(nextBlock);
        return commentCode + code + nextCode;
    }

    getAdjusted(
        block: Block,
        atId: string,
        delta = 0,
        negate = false,
        order = Order.NONE,
    ): string {
        if (block.workspace.options.oneBasedIndex) delta--;
        const defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';

        let orderForInput = order;
        if (delta > 0) orderForInput = Order.ADDITION;
        else if (delta < 0) orderForInput = Order.SUBTRACTION;
        else if (negate) orderForInput = Order.UNARY_NEGATION;

        let at = this.valueToCode(block, atId, orderForInput) || defaultAtIndex;

        if (delta === 0 && !negate) return at;
        if (stringUtils.isNumber(at)) {
            at = String(Number(at) + delta);
            if (negate) at = String(-Number(at));
            return at;
        }
        if (delta > 0) at = `${at} + ${delta}`;
        else if (delta < 0) at = `${at} - ${-delta}`;
        if (negate) at = delta ? `-(${at})` : `-${at}`;
        if (Math.floor(order) >= Math.floor(orderForInput)) at = `(${at})`;
        return at;
    }
}
