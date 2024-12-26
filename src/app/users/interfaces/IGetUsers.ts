import { IGender } from "./IGender";

export interface IGetUsers {
    userName:    string;
    rut:         string;
    name:        string;
    dateOfBirth: Date | null;
    gender:      IGender;
    email:       string;
    isActive:    number;
}