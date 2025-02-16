document.getElementById("summary-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // フォームの送信を防ぐ

    const text = document.getElementById("text").value;
    const temperature = parseFloat(document.getElementById("temperature").value);
    const max_new_token = parseInt(document.getElementById("max_new_token").value);
    const min_new_token = parseInt(document.getElementById("min_new_token").value);
    const num_beams = parseInt(document.getElementById("num_beams").value);
    const num_return_sequences = parseInt(document.getElementById("num_return_sequences").value);

    const apiUrl = "https://api-inference.huggingface.co/models/llm-book/t5-base-long-livedoor-news-corpus";
    const apiKey = "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"; // Hugging Face APIキーを設定(悪用禁止！3/10ぐらいに削除するつもりです)

    const requestData = {
        inputs: text,
        parameters: {
            temperature: temperature,
            max_new_tokens: max_new_token,
            min_new_tokens: min_new_token,
            num_beams: num_beams,
            num_return_sequences: num_return_sequences,
            do_sample: true,
            no_repeat_ngram_size: 3,
            top_k: 7,
            top_p: 0.7
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error("APIエラー: " + response.statusText);
        }

        const resultData = await response.json();
        const summaries = resultData.map(res => res.generated_text).join("\n\n");
        document.getElementById("result").textContent = summaries;
    } catch (error) {
        console.error("要約エラー:", error);
        document.getElementById("result").textContent = "要約に失敗しました。";
    }
});
