// js/helpers/promptHelpers.js

export async function loadPrompts() {
    try {
        const response = await fetch('data/prompts.json');
        if (!response.ok) {
            throw new Error('Failed to load prompts');
        }
        const data = await response.json();
        // Ensure prompts is an object
        return data.prompts || {};
    } catch (error) {
        console.error('Error loading prompts:', error);
        return {};
    }
}
