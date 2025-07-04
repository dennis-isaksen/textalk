# TexTalk
A simple progressive web application (PWA), which enables users to capture an image, and have the text contents read aloud.



## Try it
You can try the PWA on the [GitHub page](https://dennis-isaksen.github.io/textalk/) related to this repo.



## Dependencies

### Object Character Recognition (OCR) using Web Assembly (WASM)
The app contains a WASM module, which is based on the [ocrs crate](https://crates.io/crates/ocrs), of the [ocrs project](https://github.com/robertknight/ocrs). A nicely crafted Rust crate, which bases its OCR engine on recognition and detection models in [RTen](https://github.com/robertknight/rten) format.


### Language detection
The [Lingua crate](https://crates.io/crates/lingua), of the [lingua-rs project](https://github.com/pemistahl/lingua-rs) is used to detect the language of captured text.


### Fine-tuned OCR models
Fine-tuned models are used in this project. They support multiple languages, like: English, Danish, Norwegian, Swedish, German, French, Italian, Spanish, and Portuguese (and probably other Romance and Germanic languages).

The models are not at all perfect, and they will be tuned further - but they do an overall decent job on printed text. They have not been tested on hand-written text.

The fine-tuned models are [available on Hugging Face](https://huggingface.co/dennis-isaksen/ocrs-finetuned-additional-lang).

Fine-tuning was done, based on [PyTorch](https://github.com/pytorch/pytorch) checkpoint files from the [ocrs Hugging Face Model](https://huggingface.co/robertknight/ocrs), and following the [Training guide](https://github.com/robertknight/ocrs-models/blob/main/docs/training.md) provided in the [ocrs-models project](https://github.com/robertknight/ocrs-models).

Besides data from [The HierText Dataset](https://github.com/google-research-datasets/hiertext), synthetic data was used in the fine-tuning. The synthetic data was created, and incorporated, using modules from the [Data utils](https://github.com/dennis-isaksen/datautils) repo.



## Building the Project
Besides having [Rust and Cargo installed](https://www.rust-lang.org/tools/install), one needs to have wasm-pack installed, to build the WASM module:
```bash
cargo install wasm-pack
```


Afterwards, the WASM module can be built using this command.
```bash
wasm-pack build --target web
```