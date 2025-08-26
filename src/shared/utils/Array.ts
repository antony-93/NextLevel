export function chunkArray<T>(array: T[], batchSize: number): T[][] {
    const chunks: T[][] = [];
    
    for (let i = 0; i < array.length; i += batchSize) {
        chunks.push(array.slice(i, i + batchSize));
    }
    
    return chunks;
}