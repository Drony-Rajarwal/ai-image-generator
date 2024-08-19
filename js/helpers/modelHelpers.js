export async function loadModels() {
    try {
        const response = await fetch('./data/models.json');
        if (!response.ok) {
            throw new Error('Failed to load models');
        }
        const data = await response.json();
        return data.models;
    } catch (error) {
        console.error('Error loading models:', error);
        return [];
    }
}

export function populateModelDropdown(models) {
    const modelSelect = document.getElementById("modelSelect");
    if (!modelSelect) {
        console.error('Model select element not found');
        return;
    }
    models.forEach(model => {
        const option = document.createElement("option");
        option.value = model.url;
        option.textContent = model.name;
        modelSelect.appendChild(option);
    });
}
