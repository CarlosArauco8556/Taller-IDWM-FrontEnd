import { IGender } from "./Igender";

export interface IEditProfile{
    name: string;
    dateOfBirth: Date | null;
    gender: IGender;
}