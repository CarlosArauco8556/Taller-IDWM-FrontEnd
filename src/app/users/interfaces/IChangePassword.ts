/**
 * Interfaz para gestionar el cambio de contraseña de un usuario.
 * Representa los datos necesarios para realizar la operación.
 */
export interface IChangePassword {
    currentPassword: string; //Contraseña actual del usuario.
    newPassword: string;     //Nueva contraseña del usuario.
    confirmPassword: string; //Confirmación de la nueva contraseña del usuario.
}