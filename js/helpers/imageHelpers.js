export async function generateImage(promptDescription, modelUrl, apiToken) {
    const imageBox = document.getElementById("imageBox");
    const modelName = document.querySelector("#modelSelect option:checked").textContent;

    imageBox.innerHTML = `<p>Generating image: ${promptDescription} using ${modelName}...</p>`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
    };
    let body = JSON.stringify({ inputs: promptDescription });

    try {
        const response = await fetch(modelUrl, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error("Error generating image");
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        imageBox.innerHTML = `<img src="${imageUrl}" alt="Generated Image">`;

        addToHistory(promptDescription, imageUrl);
    } catch (error) {
        imageBox.innerHTML = `<p>Failed to generate image: ${error.message}</p>`;
    }
}

export function addToHistory(promptDescription, imageUrl) {
    const history = document.getElementById("history");
    const historyGrid = document.querySelector(".history-grid") || document.createElement("div");
    historyGrid.classList.add("history-grid");

    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");

    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = `${promptDescription.replace(/\s+/g, '_')}.png`;
    downloadLink.textContent = "Download Image";

    historyItem.innerHTML = `<img src="${imageUrl}" alt="Generated Image">`;
    historyItem.appendChild(downloadLink);
    historyGrid.appendChild(historyItem);

    if (!document.querySelector(".history-grid")) {
        history.appendChild(historyGrid);
    }
}
