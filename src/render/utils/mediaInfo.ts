import { FabricImage } from 'fabric'
export const getImageInfo = async (original: string): Promise<{ width: number, height: number, image: FabricImage }> => new Promise((resolve, reject) => {
    const image = new Image();
    image.src = original;
    image.onload = () => {
        const fabricImage = new FabricImage(image);
        resolve({
            width: image.width,
            height: image.height,
            image: fabricImage,
        });
    }
    image.onerror = (error) => {
        reject(error);
    }
})