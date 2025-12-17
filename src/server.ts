import { Server } from 'http';
import app from './app';
import config from './config';


async function bootstrap() {

    let server: Server;

    try {

        // Start the server
        server = app.listen(config.port, () => {
            console.log(`🚀 Server is running on http://localhost:${config.port}`);
        });

        // Function to gracefully shut down the server
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log('Server closed gracefully.');
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        };

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (error) => {
            console.log('Unhandled Rejection is detected, we are closing our server...');
            if (server) {
                server.close(() => {
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        });
    } catch (error) {
        process.exit(1);
    }
}

bootstrap();