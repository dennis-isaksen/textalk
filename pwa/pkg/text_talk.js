let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_4.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_4.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
 * @returns {Promise<void>}
 */
export function init_camera() {
    const ret = wasm.init_camera();
    return ret;
}

/**
 * @param {Uint8Array} detection_model_bytes
 * @param {Uint8Array} recognition_model_bytes
 * @returns {Promise<any>}
 */
export function capture_and_ocr(detection_model_bytes, recognition_model_bytes) {
    const ptr0 = passArray8ToWasm0(detection_model_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(recognition_model_bytes, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.capture_and_ocr(ptr0, len0, ptr1, len1);
    return ret;
}

/**
 * @param {string} text
 * @returns {Promise<string>}
 */
export function detect_language(text) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.detect_language(ptr0, len0);
    return ret;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_2.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedFloat32ArrayMemory0 = null;

function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}
function __wbg_adapter_28(arg0, arg1, arg2) {
    wasm.closure2255_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_145(arg0, arg1, arg2, arg3) {
    wasm.closure2277_externref_shim(arg0, arg1, arg2, arg3);
}

const DetectedLineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_detectedline_free(ptr >>> 0, 1));
/**
 * A line of text that has been detected, but not recognized.
 *
 * This contains information about the location of the text, but not the
 * string contents.
 */
export class DetectedLine {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DetectedLine.prototype);
        obj.__wbg_ptr = ptr;
        DetectedLineFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof DetectedLine)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DetectedLineFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_detectedline_free(ptr, 0);
    }
    /**
     * @returns {RotatedRect}
     */
    rotatedRect() {
        const ret = wasm.detectedline_rotatedRect(this.__wbg_ptr);
        return RotatedRect.__wrap(ret);
    }
    /**
     * @returns {RotatedRect[]}
     */
    words() {
        const ret = wasm.detectedline_words(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}

const ImageFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_image_free(ptr >>> 0, 1));
/**
 * A pre-processed image that can be passed as input to `OcrEngine.loadImage`.
 */
export class Image {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Image.prototype);
        obj.__wbg_ptr = ptr;
        ImageFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ImageFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_image_free(ptr, 0);
    }
    /**
     * Return the number of channels in the image.
     * @returns {number}
     */
    channels() {
        const ret = wasm.image_channels(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Return the width of the image.
     * @returns {number}
     */
    width() {
        const ret = wasm.image_width(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Return the height of the image.
     * @returns {number}
     */
    height() {
        const ret = wasm.image_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Return the image data in row-major, channels-last order.
     * @returns {Uint8Array}
     */
    data() {
        const ret = wasm.image_data(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}

const LanguageDetectorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_languagedetector_free(ptr >>> 0, 1));
/**
 * This class detects the language of given input text.
 */
export class LanguageDetector {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LanguageDetector.prototype);
        obj.__wbg_ptr = ptr;
        LanguageDetectorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LanguageDetectorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_languagedetector_free(ptr, 0);
    }
    /**
     * Detects the language of given input text.
     * If the language cannot be reliably detected, `undefined` is returned.
     * @param {string} text
     * @returns {string | undefined}
     */
    detectLanguageOf(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.languagedetector_detectLanguageOf(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * Attempts to detect multiple languages in mixed-language text.
     *
     * This feature is experimental and under continuous development.
     *
     * An array of `DetectionResult` is returned containing an entry for each contiguous
     * single-language text section as identified by the library. Each entry consists
     * of the identified language, a start index and an end index. The indices denote
     * the substring that has been identified as a contiguous single-language text section.
     * @param {string} text
     * @returns {any}
     */
    detectMultipleLanguagesOf(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.languagedetector_detectMultipleLanguagesOf(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Computes confidence values for each language supported by this detector for the given
     * input text. These values denote how likely it is that the given text has been written
     * in any of the languages supported by this detector.
     *
     * An array of two-element objects is returned containing those languages which the
     * calling instance of `LanguageDetector` has been built from, together with their
     * confidence values. The entries are sorted by their confidence value in descending order.
     * Each value is a probability between 0.0 and 1.0. The probabilities of all languages will
     * sum to 1.0. If the language is unambiguously identified by the rule engine, the value
     * 1.0 will always be returned for this language. The other languages will receive a value
     * of 0.0.
     * @param {string} text
     * @returns {any}
     */
    computeLanguageConfidenceValues(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.languagedetector_computeLanguageConfidenceValues(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Computes the confidence value for the given language and input text. This value denotes
     * how likely it is that the given text has been written in the given language.
     *
     * The value that this method computes is a number between 0.0 and 1.0. If the language is
     * unambiguously identified by the rule engine, the value 1.0 will always be returned.
     * If the given language is not supported by this detector instance, the value 0.0 will
     * always be returned.
     * @param {string} text
     * @param {string} language
     * @returns {number}
     */
    computeLanguageConfidence(text, language) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(language, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.languagedetector_computeLanguageConfidence(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
}

const LanguageDetectorBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_languagedetectorbuilder_free(ptr >>> 0, 1));
/**
 * This class configures and creates an instance of `LanguageDetector`.
 */
export class LanguageDetectorBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LanguageDetectorBuilder.prototype);
        obj.__wbg_ptr = ptr;
        LanguageDetectorBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LanguageDetectorBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_languagedetectorbuilder_free(ptr, 0);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder` with all built-in languages.
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllLanguages() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguages();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with all built-in spoken languages.
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllSpokenLanguages() {
        const ret = wasm.languagedetectorbuilder_fromAllSpokenLanguages();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with all built-in languages supporting the Arabic script.
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllLanguagesWithArabicScript() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithArabicScript();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with all built-in languages supporting the Cyrillic script.
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllLanguagesWithCyrillicScript() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithCyrillicScript();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with all built-in languages supporting the Devanagari script.
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllLanguagesWithDevanagariScript() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithDevanagariScript();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with all built-in languages supporting the Latin script.
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllLanguagesWithLatinScript() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithLatinScript();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with all built-in languages except those specified in `languages`.
     *
     * ⚠ Throws an error if no language is specified.
     * @param {...any[]} languages
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllLanguagesWithout(...languages) {
        const ptr0 = passArrayJsValueToWasm0(languages, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithout(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LanguageDetectorBuilder.__wrap(ret[0]);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with the specified `languages`.
     *
     * ⚠ Throws an error if no language is specified.
     * @param {...any[]} languages
     * @returns {LanguageDetectorBuilder}
     */
    static fromLanguages(...languages) {
        const ptr0 = passArrayJsValueToWasm0(languages, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.languagedetectorbuilder_fromLanguages(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LanguageDetectorBuilder.__wrap(ret[0]);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with the languages specified by the respective ISO 639-1 codes.
     *
     * ⚠ Throws an error if no ISO code is specified.
     * @param {...any[]} isoCodes
     * @returns {LanguageDetectorBuilder}
     */
    static fromISOCodes6391(...isoCodes) {
        const ptr0 = passArrayJsValueToWasm0(isoCodes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.languagedetectorbuilder_fromISOCodes6391(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LanguageDetectorBuilder.__wrap(ret[0]);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with the languages specified by the respective ISO 639-3 codes.
     *
     * ⚠ Throws an error if no ISO code is specified.
     * @param {...any[]} isoCodes
     * @returns {LanguageDetectorBuilder}
     */
    static fromISOCodes6393(...isoCodes) {
        const ptr0 = passArrayJsValueToWasm0(isoCodes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.languagedetectorbuilder_fromISOCodes6393(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LanguageDetectorBuilder.__wrap(ret[0]);
    }
    /**
     * Sets the desired value for the minimum relative distance measure.
     *
     * By default, *Lingua* returns the most likely language for a given
     * input text. However, there are certain words that are spelled the
     * same in more than one language. The word *prologue*, for instance,
     * is both a valid English and French word. Lingua would output either
     * English or French which might be wrong in the given context.
     * For cases like that, it is possible to specify a minimum relative
     * distance that the logarithmized and summed up probabilities for
     * each possible language have to satisfy.
     *
     * Be aware that the distance between the language probabilities is
     * dependent on the length of the input text. The longer the input
     * text, the larger the distance between the languages. So if you
     * want to classify very short text phrases, do not set the minimum
     * relative distance too high. Otherwise, you will get most results
     * returned as `undefined` which is the return value for cases
     * where language detection is not reliably possible.
     *
     * ⚠ Throws an error if `distance` is smaller than 0.0 or greater than 0.99.
     * @param {number} distance
     * @returns {LanguageDetectorBuilder}
     */
    withMinimumRelativeDistance(distance) {
        const ret = wasm.languagedetectorbuilder_withMinimumRelativeDistance(this.__wbg_ptr, distance);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LanguageDetectorBuilder.__wrap(ret[0]);
    }
    /**
     * Configures `LanguageDetectorBuilder` to preload all language models when creating
     * the instance of `LanguageDetector`.
     *
     * By default, *Lingua* uses lazy-loading to load only those language models
     * on demand which are considered relevant by the rule-based filter engine.
     * For web services, for instance, it is rather beneficial to preload all language
     * models into memory to avoid unexpected latency while waiting for the
     * service response. This method allows to switch between these two loading modes.
     * @returns {LanguageDetectorBuilder}
     */
    withPreloadedLanguageModels() {
        const ret = wasm.languagedetectorbuilder_withPreloadedLanguageModels(this.__wbg_ptr);
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Disables the high accuracy mode in order to save memory and increase performance.
     *
     * By default, *Lingua's* high detection accuracy comes at the cost of loading large
     * language models into memory which might not be feasible for systems running low on
     * resources.
     *
     * This method disables the high accuracy mode so that only a small subset of language
     * models is loaded into memory. The downside of this approach is that detection accuracy
     * for short texts consisting of less than 120 characters will drop significantly. However,
     * detection accuracy for texts which are longer than 120 characters will remain mostly
     * unaffected.
     * @returns {LanguageDetectorBuilder}
     */
    withLowAccuracyMode() {
        const ret = wasm.languagedetectorbuilder_withLowAccuracyMode(this.__wbg_ptr);
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns the configured instance of `LanguageDetector`.
     * @returns {LanguageDetector}
     */
    build() {
        const ret = wasm.languagedetectorbuilder_build(this.__wbg_ptr);
        return LanguageDetector.__wrap(ret);
    }
}

const OcrEngineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ocrengine_free(ptr >>> 0, 1));
/**
 * OcrEngine is the main API for performing OCR in WebAssembly.
 */
export class OcrEngine {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OcrEngineFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ocrengine_free(ptr, 0);
    }
    /**
     * Construct a new `OcrEngine` using the models and other settings given
     * by `init`.
     *
     * To detect text in an image, `init` must have a detection model set.
     * To recognize text, `init` must have a recognition model set.
     * @param {OcrEngineInit} init
     */
    constructor(init) {
        _assertClass(init, OcrEngineInit);
        var ptr0 = init.__destroy_into_raw();
        const ret = wasm.ocrengine_new(ptr0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        OcrEngineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Prepare an image for analysis by the OCR engine.
     *
     * The image is an array of pixels in row-major, channels last order. This
     * matches the format of the
     * [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData)
     * API. Supported channel combinations are RGB and RGBA. The number of
     * channels is inferred from the length of `data`.
     * @param {number} width
     * @param {number} height
     * @param {Uint8Array} data
     * @returns {Image}
     */
    loadImage(width, height, data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ocrengine_loadImage(this.__wbg_ptr, width, height, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Image.__wrap(ret[0]);
    }
    /**
     * Detect text in an image.
     *
     * Returns a list of lines that were found. These can be passed to
     * `recognizeText` identify the characters.
     * @param {Image} image
     * @returns {DetectedLine[]}
     */
    detectText(image) {
        _assertClass(image, Image);
        const ret = wasm.ocrengine_detectText(this.__wbg_ptr, image.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Recognize text that was previously detected with `detectText`.
     *
     * Returns a list of `TextLine` objects that can be used to query the text
     * and bounding boxes of each line.
     * @param {Image} image
     * @param {DetectedLine[]} lines
     * @returns {TextLine[]}
     */
    recognizeText(image, lines) {
        _assertClass(image, Image);
        const ptr0 = passArrayJsValueToWasm0(lines, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ocrengine_recognizeText(this.__wbg_ptr, image.__wbg_ptr, ptr0, len0);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
    /**
     * Detect and recognize text in an image.
     *
     * Returns a single string containing all the text found in reading order.
     * @param {Image} image
     * @returns {string}
     */
    getText(image) {
        let deferred2_0;
        let deferred2_1;
        try {
            _assertClass(image, Image);
            const ret = wasm.ocrengine_getText(this.__wbg_ptr, image.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Detect and recognize text in an image.
     *
     * Returns a list of `TextLine` objects that can be used to query the text
     * and bounding boxes of each line.
     * @param {Image} image
     * @returns {TextLine[]}
     */
    getTextLines(image) {
        _assertClass(image, Image);
        const ret = wasm.ocrengine_getTextLines(this.__wbg_ptr, image.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}

const OcrEngineInitFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ocrengineinit_free(ptr >>> 0, 1));
/**
 * Options for constructing an [OcrEngine].
 */
export class OcrEngineInit {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OcrEngineInitFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ocrengineinit_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.ocrengineinit_new();
        this.__wbg_ptr = ret >>> 0;
        OcrEngineInitFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Load a model for text detection.
     * @param {Uint8Array} data
     */
    setDetectionModel(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ocrengineinit_setDetectionModel(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Load a model for text recognition.
     * @param {Uint8Array} data
     */
    setRecognitionModel(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ocrengineinit_setRecognitionModel(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}

const RotatedRectFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rotatedrect_free(ptr >>> 0, 1));

export class RotatedRect {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RotatedRect.prototype);
        obj.__wbg_ptr = ptr;
        RotatedRectFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RotatedRectFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rotatedrect_free(ptr, 0);
    }
    /**
     * Return an array of the X and Y coordinates of corners of this rectangle,
     * arranged as `[x0, y0, ... x3, y3]`.
     * @returns {Float32Array}
     */
    corners() {
        const ret = wasm.rotatedrect_corners(this.__wbg_ptr);
        var v1 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Return the coordinates of the axis-aligned bounding rectangle of this
     * rotated rect.
     *
     * The result is a `[left, top, right, bottom]` array of coordinates.
     * @returns {Float32Array}
     */
    boundingRect() {
        const ret = wasm.rotatedrect_boundingRect(this.__wbg_ptr);
        var v1 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}

const TextLineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_textline_free(ptr >>> 0, 1));
/**
 * A sequence of `TextWord`s that were recognized, forming a line.
 */
export class TextLine {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TextLine.prototype);
        obj.__wbg_ptr = ptr;
        TextLineFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TextLineFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_textline_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    text() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.textline_text(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {TextWord[]}
     */
    words() {
        const ret = wasm.textline_words(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}

const TextWordFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_textword_free(ptr >>> 0, 1));
/**
 * Bounding box and text of a word that was recognized.
 */
export class TextWord {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TextWord.prototype);
        obj.__wbg_ptr = ptr;
        TextWordFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TextWordFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_textword_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    text() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.textword_text(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Return the oriented bounding rectangle containing the characters in
     * this word.
     * @returns {RotatedRect}
     */
    rotatedRect() {
        const ret = wasm.textword_rotatedRect(this.__wbg_ptr);
        return RotatedRect.__wrap(ret);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_data_d1ed736c1e42b10e = function(arg0, arg1) {
        const ret = arg1.data;
        const ptr1 = passArray8ToWasm0(ret, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_detectedline_new = function(arg0) {
        const ret = DetectedLine.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_detectedline_unwrap = function(arg0) {
        const ret = DetectedLine.__unwrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_document_d249400bd7bd996d = function(arg0) {
        const ret = arg0.document;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_drawImage_803dcc46897223c9 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.drawImage(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_getContext_e9cf379449413580 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getElementById_f827f0d6648718a8 = function(arg0, arg1, arg2) {
        const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getImageData_c02374a30b126dab = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.getImageData(arg1, arg2, arg3, arg4);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getUserMedia_dcc103aabfee99a6 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getUserMedia(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_height_838cee19ba8597db = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_df82a4d3437bf1cc = function(arg0) {
        let result;
        try {
            result = arg0 instanceof CanvasRenderingContext2D;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_2ea67072a7624ac5 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLCanvasElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlVideoElement_7f414b32f362e317 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLVideoElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_MediaStream_f7b6ed97ba2864c8 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof MediaStream;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_mediaDevices_e9977f249e2ef5d8 = function() { return handleError(function (arg0) {
        const ret = arg0.mediaDevices;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_navigator_1577371c070c8947 = function(arg0) {
        const ret = arg0.navigator;
        return ret;
    };
    imports.wbg.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_145(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_405e22f390576ce2 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_78feb108b6472713 = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_play_f6ec5fc4e84b0d26 = function() { return handleError(function (arg0) {
        const ret = arg0.play();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
        queueMicrotask(arg0);
    };
    imports.wbg.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    };
    imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_rotatedrect_new = function(arg0) {
        const ret = RotatedRect.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_set_37837023f3d740e8 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    };
    imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setheight_da683a33fa99843c = function(arg0, arg1) {
        arg0.height = arg1 >>> 0;
    };
    imports.wbg.__wbg_setsrcObject_cbb8fc611f79d4ad = function(arg0, arg1) {
        arg0.srcObject = arg1;
    };
    imports.wbg.__wbg_setvideo_1df2c133c67397a7 = function(arg0, arg1) {
        arg0.video = arg1;
    };
    imports.wbg.__wbg_setwidth_c5fed9f5e7f0b406 = function(arg0, arg1) {
        arg0.width = arg1 >>> 0;
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_textline_new = function(arg0) {
        const ret = TextLine.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_textword_new = function(arg0) {
        const ret = TextWord.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_then_48b406749878a531 = function(arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_videoHeight_3a43327a766c1f03 = function(arg0) {
        const ret = arg0.videoHeight;
        return ret;
    };
    imports.wbg.__wbg_videoWidth_4b400cf6f4744a4d = function(arg0) {
        const ret = arg0.videoWidth;
        return ret;
    };
    imports.wbg.__wbg_width_5dde457d606ba683 = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper5251 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2256, __wbg_adapter_28);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedFloat32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('text_talk_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
