import { BlobSASPermissions, BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters } from '@azure/storage-blob';

class AzureService {
    public async getAzureObject(path: string, expiresInMinutes?: number) {
        const accountName = process.env.AZURE_ACCOUNT_NAME as string;
        const accountKey = process.env.AZURE_ACCOUNT_KEY as string;
        const containerName = process.env.AZURE_CONTAINER_NAME as string;
        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            new StorageSharedKeyCredential(accountName, accountKey)
        );
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const expiresOn = expiresInMinutes ? new Date(new Date().getTime() + (expiresInMinutes * 60 * 1000)) : new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000));
        const containerSAS = generateBlobSASQueryParameters({
            containerName,
            permissions: BlobSASPermissions.parse('r'),
            startsOn: new Date(new Date().getTime() - 3000),
            expiresOn
        }, new StorageSharedKeyCredential(accountName, accountKey));

        const blobClient = containerClient.getBlobClient(path);
        return `${blobClient.url}?${containerSAS}`;
    }

    public async postAzureObject(fileBuffer: Buffer, path: string, contentType: string) {
        const accountName = process.env.AZURE_ACCOUNT_NAME as string;
        const accountKey = process.env.AZURE_ACCOUNT_KEY as string;
        const containerName = process.env.AZURE_CONTAINER_NAME as string;
        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            new StorageSharedKeyCredential(accountName, accountKey)
        );
        const containerClient = blobServiceClient.getContainerClient(containerName);

        const blockBlobClient = containerClient.getBlockBlobClient(path);
        return await blockBlobClient.upload(fileBuffer, fileBuffer.length, { blobHTTPHeaders: { blobContentType: contentType } });
    }
}

export default new AzureService();