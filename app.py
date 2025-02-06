from flask import Flask, render_template, request
from transformers import pipeline
from functools import partial
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = Flask(__name__)

# モデルを準備
model_name = "llm-book/t5-base-long-livedoor-news-corpus"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to("cpu")  # 修正: CPUを使用

fixed_model_pipeline = partial(
    pipeline,
    "summarization",
    model=model,
    tokenizer=tokenizer,
    device=-1,  # 修正: CPUを指定
)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/summarize', methods=["POST"])
def summarize():
    # フォームからの入力データを取得
    text = request.form["text"]
    temperature = float(request.form["temperature"])
    max_new_token = int(request.form["max_new_token"])
    min_new_token = int(request.form["min_new_token"])
    num_beams = int(request.form["num_beams"])
    num_return_sequences = int(request.form["num_return_sequences"])

    # 要約実行
    summarization_pipeline = fixed_model_pipeline(
        num_beams=num_beams,
        num_return_sequences=num_return_sequences,
        min_new_tokens=min_new_token,
        max_new_tokens=max_new_token,
        do_sample=True,
        temperature=temperature,
        no_repeat_ngram_size=3,
        top_k=7,
        top_p=0.7,
    )
    generated_texts = summarization_pipeline(text)

    # 結果を整形して表示
    result = "\n\n".join([res["summary_text"] for res in generated_texts])
    return render_template("index.html", result=result)

if __name__ == "__main__":
    app.run(debug=True)
