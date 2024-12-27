import { IGender } from "./IGender";

export interface IGetUsers {
    userName:    string;
    rut:         string;
    name:        string;
    dateOfBirth: Date | null;
    gender:      IGender | null;
    email:       string;
    isActive:    number | null;
}