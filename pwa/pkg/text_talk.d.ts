/* tslint:disable */
/* eslint-disable */
export function init_camera(): Promise<void>;
export function capture_and_ocr(detection_model_bytes: Uint8Array, recognition_model_bytes: Uint8Array): Promise<any>;
export function detect_language(text: string): Promise<string>;
/**
 * A line of text that has been detected, but not recognized.
 *
 * This contains information about the location of the text, but not the
 * string contents.
 */
export class DetectedLine {
  private constructor();
  free(): void;
  rotatedRect(): RotatedRect;
  words(): RotatedRect[];
}
/**
 * A pre-processed image that can be passed as input to `OcrEngine.loadImage`.
 */
export class Image {
  private constructor();
  free(): void;
  /**
   * Return the number of channels in the image.
   */
  channels(): number;
  /**
   * Return the width of the image.
   */
  width(): number;
  /**
   * Return the height of the image.
   */
  height(): number;
  /**
   * Return the image data in row-major, channels-last order.
   */
  data(): Uint8Array;
}
/**
 * This class detects the language of given input text.
 */
export class LanguageDetector {
  private constructor();
  free(): void;
  /**
   * Detects the language of given input text.
   * If the language cannot be reliably detected, `undefined` is returned.
   */
  detectLanguageOf(text: string): string | undefined;
  /**
   * Attempts to detect multiple languages in mixed-language text.
   *
   * This feature is experimental and under continuous development.
   *
   * An array of `DetectionResult` is returned containing an entry for each contiguous
   * single-language text section as identified by the library. Each entry consists
   * of the identified language, a start index and an end index. The indices denote
   * the substring that has been identified as a contiguous single-language text section.
   */
  detectMultipleLanguagesOf(text: string): any;
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
   */
  computeLanguageConfidenceValues(text: string): any;
  /**
   * Computes the confidence value for the given language and input text. This value denotes
   * how likely it is that the given text has been written in the given language.
   *
   * The value that this method computes is a number between 0.0 and 1.0. If the language is
   * unambiguously identified by the rule engine, the value 1.0 will always be returned.
   * If the given language is not supported by this detector instance, the value 0.0 will
   * always be returned.
   */
  computeLanguageConfidence(text: string, language: string): number;
}
/**
 * This class configures and creates an instance of `LanguageDetector`.
 */
export class LanguageDetectorBuilder {
  private constructor();
  free(): void;
  /**
   * Creates and returns an instance of `LanguageDetectorBuilder` with all built-in languages.
   */
  static fromAllLanguages(): LanguageDetectorBuilder;
  /**
   * Creates and returns an instance of `LanguageDetectorBuilder`
   * with all built-in spoken languages.
   */
  static fromAllSpokenLanguages(): LanguageDetectorBuilder;
  /**
   * Creates and returns an instance of `LanguageDetectorBuilder`
   * with all built-in languages supporting the Arabic script.
   */
  static fromAllLanguagesWithArabicScript(): LanguageDetectorBuilder;
  /**
   * Creates and returns an instance of `LanguageDetectorBuilder`
   * with all built-in languages supporting the Cyrillic script.
   */
  static fromAllLanguagesWithCyrillicScript(): LanguageDetectorBuilder;
  /**
   * Creates and returns an instance of `LanguageDetectorBuilder`
   * with all built-in languages supporting the Devanagari script.
   */
  static fromAllLanguagesWithDevanagariScript(): LanguageDetectorBuilder;
  /**
   * Creates and returns an instance of `LanguageDetectorBuilder`
   * with all built-in languages supporting the Latin script.
   */
  static fromAllLanguagesWithLatinScript(): LanguageDetectorBuilder;
  /**
   * Creates and returns an instance of `LanguageDetectorBuilder`
   * with all built-in languages except those specified in `languages`.
   *
   * ⚠ Throws an error if no language is specified.
   */
  static fromAllLanguagesWithout(...languages: any[]): LanguageDetectorBuilder;
  /**
   * Creates and returns an instance of `LanguageDetectorBuilder`
   * with the specified `languages`.
   *
   * ⚠ Throws an error if no language is specified.
   */
  static fromLanguages(...languages: any[]): LanguageDetectorBuilder;
  /**
   * Creates and returns an instance of `LanguageDetectorBuilder`
   * with the languages specified by the respective ISO 639-1 codes.
   *
   * ⚠ Throws an error if no ISO code is specified.
   */
  static fromISOCodes6391(...isoCodes: any[]): LanguageDetectorBuilder;
  /**
   * Creates and returns an instance of `LanguageDetectorBuilder`
   * with the languages specified by the respective ISO 639-3 codes.
   *
   * ⚠ Throws an error if no ISO code is specified.
   */
  static fromISOCodes6393(...isoCodes: any[]): LanguageDetectorBuilder;
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
   */
  withMinimumRelativeDistance(distance: number): LanguageDetectorBuilder;
  /**
   * Configures `LanguageDetectorBuilder` to preload all language models when creating
   * the instance of `LanguageDetector`.
   *
   * By default, *Lingua* uses lazy-loading to load only those language models
   * on demand which are considered relevant by the rule-based filter engine.
   * For web services, for instance, it is rather beneficial to preload all language
   * models into memory to avoid unexpected latency while waiting for the
   * service response. This method allows to switch between these two loading modes.
   */
  withPreloadedLanguageModels(): LanguageDetectorBuilder;
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
   */
  withLowAccuracyMode(): LanguageDetectorBuilder;
  /**
   * Creates and returns the configured instance of `LanguageDetector`.
   */
  build(): LanguageDetector;
}
/**
 * OcrEngine is the main API for performing OCR in WebAssembly.
 */
export class OcrEngine {
  free(): void;
  /**
   * Construct a new `OcrEngine` using the models and other settings given
   * by `init`.
   *
   * To detect text in an image, `init` must have a detection model set.
   * To recognize text, `init` must have a recognition model set.
   */
  constructor(init: OcrEngineInit);
  /**
   * Prepare an image for analysis by the OCR engine.
   *
   * The image is an array of pixels in row-major, channels last order. This
   * matches the format of the
   * [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData)
   * API. Supported channel combinations are RGB and RGBA. The number of
   * channels is inferred from the length of `data`.
   */
  loadImage(width: number, height: number, data: Uint8Array): Image;
  /**
   * Detect text in an image.
   *
   * Returns a list of lines that were found. These can be passed to
   * `recognizeText` identify the characters.
   */
  detectText(image: Image): DetectedLine[];
  /**
   * Recognize text that was previously detected with `detectText`.
   *
   * Returns a list of `TextLine` objects that can be used to query the text
   * and bounding boxes of each line.
   */
  recognizeText(image: Image, lines: DetectedLine[]): TextLine[];
  /**
   * Detect and recognize text in an image.
   *
   * Returns a single string containing all the text found in reading order.
   */
  getText(image: Image): string;
  /**
   * Detect and recognize text in an image.
   *
   * Returns a list of `TextLine` objects that can be used to query the text
   * and bounding boxes of each line.
   */
  getTextLines(image: Image): TextLine[];
}
/**
 * Options for constructing an [OcrEngine].
 */
export class OcrEngineInit {
  free(): void;
  constructor();
  /**
   * Load a model for text detection.
   */
  setDetectionModel(data: Uint8Array): void;
  /**
   * Load a model for text recognition.
   */
  setRecognitionModel(data: Uint8Array): void;
}
export class RotatedRect {
  private constructor();
  free(): void;
  /**
   * Return an array of the X and Y coordinates of corners of this rectangle,
   * arranged as `[x0, y0, ... x3, y3]`.
   */
  corners(): Float32Array;
  /**
   * Return the coordinates of the axis-aligned bounding rectangle of this
   * rotated rect.
   *
   * The result is a `[left, top, right, bottom]` array of coordinates.
   */
  boundingRect(): Float32Array;
}
/**
 * A sequence of `TextWord`s that were recognized, forming a line.
 */
export class TextLine {
  private constructor();
  free(): void;
  text(): string;
  words(): TextWord[];
}
/**
 * Bounding box and text of a word that was recognized.
 */
export class TextWord {
  private constructor();
  free(): void;
  text(): string;
  /**
   * Return the oriented bounding rectangle containing the characters in
   * this word.
   */
  rotatedRect(): RotatedRect;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly init_camera: () => any;
  readonly capture_and_ocr: (a: number, b: number, c: number, d: number) => any;
  readonly detect_language: (a: number, b: number) => any;
  readonly __wbg_languagedetectorbuilder_free: (a: number, b: number) => void;
  readonly __wbg_languagedetector_free: (a: number, b: number) => void;
  readonly languagedetectorbuilder_fromAllLanguages: () => number;
  readonly languagedetectorbuilder_fromAllSpokenLanguages: () => number;
  readonly languagedetectorbuilder_fromAllLanguagesWithArabicScript: () => number;
  readonly languagedetectorbuilder_fromAllLanguagesWithCyrillicScript: () => number;
  readonly languagedetectorbuilder_fromAllLanguagesWithDevanagariScript: () => number;
  readonly languagedetectorbuilder_fromAllLanguagesWithLatinScript: () => number;
  readonly languagedetectorbuilder_fromAllLanguagesWithout: (a: number, b: number) => [number, number, number];
  readonly languagedetectorbuilder_fromLanguages: (a: number, b: number) => [number, number, number];
  readonly languagedetectorbuilder_fromISOCodes6391: (a: number, b: number) => [number, number, number];
  readonly languagedetectorbuilder_fromISOCodes6393: (a: number, b: number) => [number, number, number];
  readonly languagedetectorbuilder_withMinimumRelativeDistance: (a: number, b: number) => [number, number, number];
  readonly languagedetectorbuilder_withPreloadedLanguageModels: (a: number) => number;
  readonly languagedetectorbuilder_withLowAccuracyMode: (a: number) => number;
  readonly languagedetectorbuilder_build: (a: number) => number;
  readonly languagedetector_detectLanguageOf: (a: number, b: number, c: number) => [number, number];
  readonly languagedetector_detectMultipleLanguagesOf: (a: number, b: number, c: number) => any;
  readonly languagedetector_computeLanguageConfidenceValues: (a: number, b: number, c: number) => any;
  readonly languagedetector_computeLanguageConfidence: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly __wbg_ocrengineinit_free: (a: number, b: number) => void;
  readonly ocrengineinit_new: () => number;
  readonly ocrengineinit_setDetectionModel: (a: number, b: number, c: number) => [number, number];
  readonly ocrengineinit_setRecognitionModel: (a: number, b: number, c: number) => [number, number];
  readonly __wbg_ocrengine_free: (a: number, b: number) => void;
  readonly ocrengine_new: (a: number) => [number, number, number];
  readonly ocrengine_loadImage: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly ocrengine_detectText: (a: number, b: number) => [number, number, number, number];
  readonly ocrengine_recognizeText: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly ocrengine_getText: (a: number, b: number) => [number, number, number, number];
  readonly ocrengine_getTextLines: (a: number, b: number) => [number, number, number, number];
  readonly __wbg_image_free: (a: number, b: number) => void;
  readonly image_channels: (a: number) => number;
  readonly image_width: (a: number) => number;
  readonly image_height: (a: number) => number;
  readonly image_data: (a: number) => [number, number];
  readonly __wbg_rotatedrect_free: (a: number, b: number) => void;
  readonly rotatedrect_corners: (a: number) => [number, number];
  readonly rotatedrect_boundingRect: (a: number) => [number, number];
  readonly __wbg_detectedline_free: (a: number, b: number) => void;
  readonly detectedline_rotatedRect: (a: number) => number;
  readonly detectedline_words: (a: number) => [number, number];
  readonly __wbg_textword_free: (a: number, b: number) => void;
  readonly textword_text: (a: number) => [number, number];
  readonly textword_rotatedRect: (a: number) => number;
  readonly __wbg_textline_free: (a: number, b: number) => void;
  readonly textline_text: (a: number) => [number, number];
  readonly textline_words: (a: number) => [number, number];
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __externref_drop_slice: (a: number, b: number) => void;
  readonly closure2255_externref_shim: (a: number, b: number, c: any) => void;
  readonly closure2277_externref_shim: (a: number, b: number, c: any, d: any) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
