import { Request, Response, NextFunction } from "express";

export const performanceLogger = (routeName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const startTime = process.hrtime.bigint();

        // Log request info
        console.log('\n' + '='.repeat(80));
        console.log(`   [${routeName}] Request Started`);
        console.log(`   Method: ${req.method}`);
        console.log(`   Path: ${req.path}`);
        console.log(`   Params:`, req.params);
        console.log(`   User ID: ${req.user?.id || 'Not authenticated'}`);
        console.log(`   Timestamp: ${new Date().toISOString()}`);
        console.log('='.repeat(80));

        // Capture the original end function
        const originalEnd = res.end;

        // Override res.end to log after response
        res.end = function (chunk?: any, encoding?: any, callback?: any): any {
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds

            console.log('\n' + '='.repeat(80));
            console.log(`   [${routeName}] Request Completed`);
            console.log(`   Status Code: ${res.statusCode}`);
            console.log(`   Duration: ${duration.toFixed(3)} ms`);
            console.log(`   Timestamp: ${new Date().toISOString()}`);
            console.log('='.repeat(80) + '\n');

            // Call the original end function
            return originalEnd.call(this, chunk, encoding, callback);
        };

        next();
    };
};
