use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::{HtmlCanvasElement, HtmlVideoElement, MediaStreamConstraints};
use ocrs::{OcrEngine, OcrEngineParams, ImageSource, TextLine, TextItem};
use rten::Model;
use serde::Serialize;
use serde_json::json;

#[derive(Serialize)]
struct Point {
    x: f32,
    y: f32,
}

#[wasm_bindgen]
pub async fn init_camera() -> Result<(), JsValue> {
    let window = web_sys::window().unwrap();
    let document = window.document().unwrap();
    let video = document.get_element_by_id("video").unwrap().dyn_into::<HtmlVideoElement>()?;
    let navigator = window.navigator();
    let media_devices = navigator.media_devices()?;
    let constraints = MediaStreamConstraints::new();
    constraints.set_video(&JsValue::TRUE);
    js_sys::Reflect::set(&constraints, &JsValue::from_str("video"), &JsValue::TRUE)?;
    let stream_promise = media_devices.get_user_media_with_constraints(&constraints)?;
    let stream = JsFuture::from(stream_promise).await?;
    let stream = stream.dyn_into::<web_sys::MediaStream>()?;
    video.set_src_object(Some(&stream));
    let play_promise = video.play()?;
    JsFuture::from(play_promise).await?;

    // Wait for the video to start playing and get the dimensions
    let video_width = video.video_width();
    let video_height = video.video_height();

    // Adjust the canvas dimensions to match the video dimensions
    let canvas = document.get_element_by_id("canvas").unwrap().dyn_into::<HtmlCanvasElement>()?;
    canvas.set_width(video_width);
    canvas.set_height(video_height);

    Ok(())
}

#[wasm_bindgen]
pub async fn capture_and_ocr(detection_model_bytes: Vec<u8>, recognition_model_bytes: Vec<u8>) -> Result<JsValue, JsValue> {
    let window = web_sys::window().unwrap();
    let document = window.document().unwrap();
    let video = document.get_element_by_id("video").unwrap().dyn_into::<HtmlVideoElement>()?;
    let canvas = document.get_element_by_id("canvas").unwrap().dyn_into::<HtmlCanvasElement>()?;
    let context = canvas.get_context("2d")?.unwrap().dyn_into::<web_sys::CanvasRenderingContext2d>()?;
    context.draw_image_with_html_video_element(&video, 0.0, 0.0)?;
    
    // Convert the image data to a byte array
    let image_data = context.get_image_data(0.0, 0.0, canvas.width() as f64, canvas.height() as f64)
        .map_err(|e| JsValue::from_str(&e.as_string().unwrap_or_else(|| "Failed to get image data".to_string())))?;
    let data = image_data.data().to_vec();
    let dimensions = (canvas.width(), canvas.height());

    // Use the correct method to load the model from bytes
    let detection_model = Model::load(detection_model_bytes).map_err(|e| JsValue::from_str(&e.to_string()))?;
    let recognition_model = Model::load(recognition_model_bytes).map_err(|e| JsValue::from_str(&e.to_string()))?;

    let da_alphabet = String::from(" 0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~EABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÆØÅæøå");
    
    let ocr_engine = OcrEngine::new(OcrEngineParams {
        detection_model: Some(detection_model),
        recognition_model: Some(recognition_model),
        alphabet: Some(da_alphabet),
        ..Default::default()
    }).map_err(|e| JsValue::from_str(&e.to_string()))?;
    let image_source = ImageSource::from_bytes(&data, dimensions).map_err(|e| JsValue::from_str(&e.to_string()))?;
    let ocr_input = ocr_engine.prepare_input(image_source).map_err(|e| JsValue::from_str(&e.to_string()))?;
    let words = ocr_engine.detect_words(&ocr_input).map_err(|e| JsValue::from_str(&e.to_string()))?;
    
    let word_rects = ocr_engine.find_text_lines(&ocr_input, &words);
    let text_lines: Vec<Option<TextLine>> = ocr_engine.recognize_text(&ocr_input, &word_rects).map_err(|e| JsValue::from_str(&e.to_string()))?;

    let line_items: Vec<_> = text_lines
        .iter()
        .filter_map(|line| line.as_ref())
        .map(|line| {
            let word_items: Vec<_> = line
                .words()
                .map(|word| {
                    json!({
                        "text": word.to_string(),
                        "vertices": &word.rotated_rect().corners().iter().map(|corner| Point { x: corner.x, y: corner.y }).collect::<Vec<_>>(),
                    })
                })
                .collect();

            json!({
                "text": line.to_string(),
                "words": word_items,
                "vertices": &line.rotated_rect().corners().iter().map(|corner| Point { x: corner.x, y: corner.y }).collect::<Vec<_>>(),
            })
        })
        .collect();
    let result = serde_json::Value::Array(line_items).to_string();
    Ok(JsValue::from_str(&result))
}
