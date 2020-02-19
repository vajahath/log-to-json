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
  constructor(options: IConvertLogToJSON) {
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
    console.log('[holding] ', this._laggedLine);
    cb();
  }

  /**
   * @param {object} cb
   * @return {null}
   */
  _flush(cb: () => void) {
    console.log('[flushing] ', this._laggedLine);
    if (this._laggedLine) {
      this.push(', ' + this._laggedLine);
    }
    this.push(']');
    return cb();
  }
}
