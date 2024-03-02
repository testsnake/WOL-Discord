import devices from "./devices.json";

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

async function wol(deviceId: string, interaction: any, requiredPermissions: devicePermission): Promise<boolean> {
    // 1 second fake delay for testing
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(false);
        }, 5000);
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

export { getDevices, searchDevices, wol, ping, devicePermission };