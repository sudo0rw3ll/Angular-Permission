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