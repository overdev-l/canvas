export const getContainer = (container: string) => {
    const element = document.getElementById(container);
    if (!element) {
        throw new Error(`Container with id ${container} not found`);
    }
    const rect = element.getBoundingClientRect();
    return {
        element,
        width: rect.width,
        height: rect.height,
    };
}