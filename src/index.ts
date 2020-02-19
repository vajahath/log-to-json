import { Transform, PassThrough } from 'stream';
import { createInterface as createRLI } from 'readline';

export interface IConvertLogToJSON {}

/**
 * @param {object} options
 */
export class LogToJSON extends Transform {
  private _isInitialPush: boolean;
  private _laggedLine: string | null;

  /**
   * @param {object} options
   */
  constructor(options?: IConvertLogToJSON) {
    super(options);
    this._isInitialPush = true;
    this._laggedLine = null;
  }

  /**
   * @param {object} chunk
   * @param {object} enc
   * @param {func} cb
   */
  async _transform(chunk: Buffer | string, enc: string, cb: () => void) {
    if (!(chunk instanceof Buffer)) {
      chunk = Buffer.from(chunk);
    }

    try {
      // check if the holding line is a complete object
      if (this._laggedLine) {
        JSON.parse(this._laggedLine);
        this._laggedLine = '\n' + this._laggedLine + '\n';
      }
    } catch (err) {
      // nothing here
    }

    chunk = Buffer.concat([Buffer.from(this._laggedLine || ''), chunk]);
    this._laggedLine = null;

    const bufferedInput = new PassThrough();
    bufferedInput.end(chunk);

    const rl = createRLI({
      input: bufferedInput
    });

    for await (const line of rl) {
      if (this._laggedLine) {
        const preparedLine = `${this._isInitialPush ? '[' : ','}${
          this._laggedLine
        }\n`;
        this.push(preparedLine);
        if (this._isInitialPush) {
          this._isInitialPush = false;
        }
      }

      this._laggedLine = line;
    }
    cb();
  }

  /**
   * @param {object} cb
   * @return {null}
   */
  _flush(cb: () => void) {
    if (this._laggedLine) {
      this.push(',' + this._laggedLine);
    }
    this.push(']');
    return cb();
  }
}
