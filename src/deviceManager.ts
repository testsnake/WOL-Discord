import devices from "./devices.json";
import wol from "wake_on_lan";

type typePermission = "wol" | "ping";

type devicePermission = {
    [Key in typePermission]?: boolean
}

function getDevices() {
    return devices;
}

function searchDevices(searchText: string, userId: string, requiredPermissions: devicePermission): { name: string, value: string }[] {
    const search = searchText.toLowerCase();
    return devices.list.filter((device: any) => {
        // Check device name
        const isMatch = device.name.toLowerCase().includes(search);
        
        // Permission check
        const userHasPermission = device.permittedUsers.some((user: any) => {
            const isUser = user.id === userId;
            let hasPermissions = isUser;
            if (isUser) {
                for (const [permission, isRequired] of Object.entries(requiredPermissions)) {
                    // Permission is required but user does not have it
                    if (isRequired && !user.permissions[permission]) {
                        hasPermissions = false;
                        break; // Exit loop early
                    }
                }
            }
            return hasPermissions;
        });

        return isMatch && userHasPermission;
    }).map((device: any) => ({
        name: device.name,
        value: device.id
    }));
}

async function wake(deviceId: string, interaction: any, requiredPermissions: devicePermission): Promise<void> {
    let device = devices.list.find((device: any) => device.id === deviceId);
    if (!device) {
        throw new Error("Device not found");
    }
    // permission check
    const userHasPermission = device.permittedUsers.some((user: any) => {
        const isUser = user.id === interaction.user.id;
        let hasPermissions = isUser;
        if (isUser) {
            for (const [permission, isRequired] of Object.entries(requiredPermissions)) {
                // Permission is required but user does not have it
                if (isRequired && !user.permissions[permission]) {
                    hasPermissions = false;
                    break; // Exit loop early
                }
            }
        }
        return hasPermissions;
    });

    if (!userHasPermission) {
        throw new Error("User does not have permission to wake device");
    }
    wol.wake(device.network.macAddress, (error: any) => {
        if (error) {
            throw new Error("Failed to wake device");
        } else {
            return;
        }
    });

    
}

async function ping(deviceId: string, interaction: any, requiredPermissions: devicePermission): Promise<boolean>  {
    // 1 second fake delay for testing
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(false);
        }, 5000);
    });
}

export { getDevices, searchDevices, wake, ping, devicePermission };