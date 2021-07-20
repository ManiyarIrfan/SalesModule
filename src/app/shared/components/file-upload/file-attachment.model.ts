import { Subscription } from 'rxjs';

/**
 * Entity to store file attachment details
 */
export class FileAttachment {
    name: string;
    type: string;
    size: string;
    content: string;
    metadata: Metadata[] = [];
    documentName?: string;
    sub?: Subscription;
}

/**
 * Entity to store metadata
 */
export class Metadata {
    key: string;
    value: string;
}

export class FileUploadModel {
    data: File;
    state: string;
    inProgress: boolean;
    progress: number;
    canRetry: boolean;
    canCancel: boolean;
    sub?: Subscription;
}

