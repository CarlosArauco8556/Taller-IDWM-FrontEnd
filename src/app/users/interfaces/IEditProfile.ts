import { IGender } from "./IGender";
/**
 * Interface que representa los datos que se pueden editar en el perfil de un usuario
 */
export interface IEditProfile{
    name: string;              //Nombre del usuario
    dateOfBirth: Date | null;  //Fecha de nacimiento del usuario
    gender: IGender | null;    //Género del usuario
}