import os from "os"; // Import os module for getting local network details


export const getLocalIPAddress = (): string => {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const networkInterface = networkInterfaces[interfaceName];
        if (networkInterface) {
            for (const net of networkInterface) {
                // Check for IPv4 and non-internal (non-localhost) addresses
                if (net.family === "IPv4" && !net.internal) {
                    return net.address;
                }
            }
        }
    }
    return "localhost"; // Fallback to localhost if no external IP is found
};