export const validTransitions: Record<string, string[]> = {
    CREATED: ['PENDING_3DS', 'SUCCESS', 'FAILED'],
    PENDING_3DS: ['SUCCESS', 'FAILED'],
    SUCCESS: [],
    FAILED: []
};