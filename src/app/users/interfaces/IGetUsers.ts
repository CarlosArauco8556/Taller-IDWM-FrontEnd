import { IGender } from "./IGender";
/**
 * Interface que representa los datos que se pueden obtener de un usuario
 */
export interface IGetUsers {
    userName:    string;          //Nombre de usuario
    rut:         string;          //Rut del usuario
    name:        string;          //Nombre del usuario
    dateOfBirth: Date | null;     //Fecha de nacimiento del usuario
    gender:      IGender | null;  //Género del usuario
    email:       string;          //Correo electrónico del usuario
    isActive:    number | null;   //Estado de la cuenta del usuario
}