import { CustomVisualization } from '../types';

const STORAGE_KEY = 'custom_visualizations';

export const getCustomVisualizations = (): CustomVisualization[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to parse custom visualizations from localStorage", error);
        return [];
    }
};

export const saveCustomVisualization = (visualization: CustomVisualization) => {
    const existing = getCustomVisualizations();
    // Avoid duplicates by name
    if (!existing.some(v => v.name === visualization.name)) {
        const updated = [...existing, visualization];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
};

export const exportVisualizations = () => {
    const customVisualizations = getCustomVisualizations();
    if (customVisualizations.length === 0) {
        alert("No custom visualizations to export.");
        return;
    }
    const dataStr = JSON.stringify(customVisualizations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = 'audiovisualizer-styles.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
};

export const importVisualizations = (
    event: React.ChangeEvent<HTMLInputElement>,
    onComplete: (imported: CustomVisualization[]) => void
) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error("File is not valid text.");
            
            const imported = JSON.parse(text) as CustomVisualization[];
            if (!Array.isArray(imported)) throw new Error("JSON is not an array.");

            let addedCount = 0;
            const existing = getCustomVisualizations();

            imported.forEach(vis => {
                // Basic validation and avoid duplicates
                if (vis.name && vis.code && !existing.some(v => v.name === vis.name)) {
                    existing.push({ ...vis, isCustom: true });
                    addedCount++;
                }
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
            if (onComplete) onComplete(imported);
        } catch (error) {
            console.error("Failed to import visualizations:", error);
            alert("Import failed. Please make sure the file is a valid JSON export.");
        } finally {
            // Reset file input to allow importing the same file again
            if (event.target) event.target.value = '';
        }
    };
    reader.readAsText(file);
};
