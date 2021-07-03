export type Policy = {
    entity: string;
    action: string;
}

export enum Actions {
    
}

export enum Operations {
    Read = "read",
    Create = "create",
    Update = "update",
    Delete = "Delete"
}

export enum Roles {
    Admin = "admin",
    Worker = "worker",
    User = "user"
}

export enum Entity {
    User = "user",
    Email = "email",

}

export type Action = string;
export type Operation = string;