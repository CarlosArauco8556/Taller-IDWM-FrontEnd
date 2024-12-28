import { IGender } from "./IGender";

export interface IEditProfile{
    name: string;
    dateOfBirth: Date | null;
    gender: IGender | null;
}