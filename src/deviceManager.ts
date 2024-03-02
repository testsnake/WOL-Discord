import { CommandInteraction, Interaction } from "discord.js";
import devices from "./devices.json";
import wol from "wake_on_lan";
import ping from "ping";

type typePermission = "wol" | "ping";

type devicePermission = {
    [Key in typePermission]?: boolean
}

type Device = {
    id: string;
    name: string;
    network: {
        macAddress: string;
        ipAddress: string;
    };
    permittedUsers: {
        id: string;
        permissions: devicePermission
    }[];
} | undefined

function getDevices() {
    return devices;
}

enum ActionResult {
    Success = "success",
    DeviceNotFound = "devicenotfound",
    PermissionDenied = "permissiondenied",
    ActionFailed = "actionfailed"
}

function searchDevices(searchText: string, userId: string, requiredPermissions: devicePermission): { name: string, value: string }[] {
    const search = searchText.toLowerCase();
    return devices.list.filter((device: any) => {
        // Check device name
        const isMatch = device.name.toLowerCase().includes(search);
        
        // Permission check
        const userHasPermission = permissionCheck(device, userId, requiredPermissions);

        return isMatch && userHasPermission;
    }).map((device: any) => ({
        name: device.name,
        value: device.id
    }));
}

async function wake(deviceId: string, interaction: Interaction | CommandInteraction, requiredPermissions: devicePermission): Promise<ActionResult> {
    const device: Device = devices.list.find((device: any) => device.id === deviceId);
    if (!device) {
        return ActionResult.DeviceNotFound;
    }
    // permission check
    const userHasPermission = permissionCheck(device, interaction.user.id, requiredPermissions);

    // Fake device not found to avoid leaking device information
    if (!userHasPermission) {
        return ActionResult.DeviceNotFound;
    }

    wol.wake(device.network.macAddress, (error: any) => {
        if (error) {
            throw new Error("Failed to wake device");
        } else {
            return;
        }
    });
    return ActionResult.Success;
}

async function sendPing(deviceId: string, interaction: Interaction | CommandInteraction, requiredPermissions: devicePermission): Promise<ping.PingResponse | ActionResult>  {
    const device: Device = devices.list.find((device: any) => device.id === deviceId);
    if (!device) {
        return ActionResult.DeviceNotFound;
    }
    
    // permission check
    const userHasPermission = permissionCheck(device, interaction.user.id, requiredPermissions);

    // Fake device not found to avoid leaking device information
    if (!userHasPermission) {
        return ActionResult.DeviceNotFound;
    }

    // Ping the device
    const result = await ping.promise.probe(device.network.ipAddress);
    return result;
}


function permissionCheck(device: Device, userId: string, requiredPermissions: devicePermission): boolean {
    if (!device) {
        return false;
    }
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
    return userHasPermission;
}

export { getDevices, searchDevices, wake, sendPing, devicePermission, ActionResult };