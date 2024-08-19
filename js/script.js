// js/script.js

import { loadModels, populateModelDropdown } from './helpers/modelHelpers.js';
import { loadPrompts } from './helpers/promptHelpers.js';
import { generateImage } from './helpers/imageHelpers.js';
import config from './config.js';  // Import config here

let shouldContinue = true;
let currentCollection = 'batmanIronManHybrid'; // Default collection

async function showLoader() {
    document.getElementById("loader").style.display = 'inline-block';
}

async function hideLoader() {
    document.getElementById("loader").style.display = 'none';
}

async function generateImagesSequentially() {
    shouldContinue = true;
    const startButton = document.getElementById("startButton");
    const stopButton = document.getElementById("stopButton");

    startButton.style.display = 'none';  // Hide start button
    stopButton.style.display = 'inline-block';  // Show stop button

    await showLoader();

    const prompts = await loadPrompts();
    if (!prompts || !prompts[currentCollection]) {
        console.error('Prompts data is invalid or collection does not exist');
        stopButton.style.display = 'none';
        startButton.style.display = 'inline-block';  // Show start button again
        await hideLoader();
        return;
    }

    const promptList = prompts[currentCollection];
    const modelSelect = document.getElementById("modelSelect");
    const modelUrl = modelSelect ? modelSelect.value : '';
    const apiToken = config.apiToken;

    for (const prompt of promptList) {
        if (!shouldContinue) break;
        await generateImage(prompt, modelUrl, apiToken);
    }

    stopButton.style.display = 'none';  // Hide stop button
    startButton.style.display = 'inline-block';  // Show start button again
    await hideLoader();
}

async function generateCustomImage() {
    const customPromptInput = document.getElementById("customPrompt");
    const customPrompt = customPromptInput.value.trim();

    if (customPrompt === '') {
        alert('Please enter a custom prompt.');
        return;
    }

    const modelSelect = document.getElementById("modelSelect");
    const modelUrl = modelSelect ? modelSelect.value : '';
    const apiToken = config.apiToken;

    await showLoader();
    await generateImage(customPrompt, modelUrl, apiToken);
    await hideLoader();
}

function startGeneratingSequentially() {
    generateImagesSequentially();
}

function stopGeneration() {
    shouldContinue = false;
    document.getElementById("stopButton").style.display = 'none';  // Hide stop button
    document.getElementById("startButton").style.display = 'inline-block';  // Show start button
}

document.addEventListener("DOMContentLoaded", async () => {
    const models = await loadModels();
    populateModelDropdown(models);

    // Populate collection dropdown
    const collectionSelect = document.getElementById("collectionSelect");
    if (collectionSelect) {
        const prompts = await loadPrompts();
        if (prompts) {
            Object.keys(prompts).forEach(collection => {
                const option = document.createElement("option");
                option.value = collection;
                option.textContent = collection;
                collectionSelect.appendChild(option);
            });
            collectionSelect.addEventListener('change', (event) => {
                currentCollection = event.target.value;
            });
        } else {
            console.error('Failed to load prompts or prompts is not defined');
        }
    }

    // Attach event listeners
    document.getElementById("startButton").addEventListener("click", startGeneratingSequentially);
    document.getElementById("stopButton").addEventListener("click", stopGeneration);
    document.getElementById("generateCustomButton").addEventListener("click", generateCustomImage);
});
