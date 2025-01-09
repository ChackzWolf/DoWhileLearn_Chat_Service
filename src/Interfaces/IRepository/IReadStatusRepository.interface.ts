export interface IReadStatusRepository {
    getLastReadTimestamp(userId: string, courseId: string): Promise<Date>
    updateLastRead(userId: string, courseId: string, timestamp: Date): Promise<void> 
}