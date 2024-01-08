export interface User {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    permissions: Array<Permission>
}

export interface Permission {
    id: number,
    permission: string
}

export interface Vacuum {
    id: number,
    active: boolean,
    added_by: number,
    dateCreated: number,
    name: string,
    status: string,
    version: number
}

export interface VacuumJob {
    id: number,
    version: number,
    time: number,
    vacuum: number,
    is_active: boolean,
    action: string
}

export interface Error {
    id: number,
    message: string,
    vaccum_id: number,
    operation: string,
    time: number
}